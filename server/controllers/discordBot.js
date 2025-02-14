const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const Payment = require('../models/paymentModel');
const xlsx = require('xlsx');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessages, // Intent for DMs
    ],
    partials: ['CHANNEL'],
});


const FEE_NOTIFY_CHANNEL_ID = process.env.FEE_NOTIFY_CHANNEL_ID;
const VERIFIED_CHANNEL_ID = process.env.VERIFIED_CHANNEL_ID;
const REJECTED_CHANNEL_ID = process.env.REJECTED_CHANNEL_ID;

const DATA_FILE_PATH = './paymentDetails.json'; // Path to your JSON file

// Load payment details from a JSON file
function loadPaymentDetails() {
    if (fs.existsSync(DATA_FILE_PATH)) {
        const data = fs.readFileSync(DATA_FILE_PATH);
        return JSON.parse(data);
    }
    return {};
}

// Save payment details to a JSON file
function savePaymentDetails(paymentDetails) {
    fs.writeFileSync(DATA_FILE_PATH, JSON.stringify(paymentDetails, null, 2));
}

// Load payment details on startup
const paymentDetailsMap = loadPaymentDetails();

async function updateStatusInExcel(filePath, transactionId, newStatus) {
    let workbook;
    if (fs.existsSync(filePath)) {
        workbook = xlsx.readFile(filePath);
    } else {
        console.error('Excel file does not exist.');
        return;
    }

    const sheetName = 'Payments';
    const worksheet = workbook.Sheets[sheetName];

    // Get the range of existing data
    const range = worksheet['!ref'] ? xlsx.utils.decode_range(worksheet['!ref']) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };

    let transactionRowIndex = -1;

    // Loop through the rows to find the transaction ID
    for (let rowIndex = range.s.r; rowIndex <= range.e.r; rowIndex++) {
        const cellAddress = xlsx.utils.encode_cell({ c: 2, r: rowIndex }); // Assuming transactionId is in the third column (index 2)
        const cellValue = worksheet[cellAddress]?.v; // Get the value of the cell

        if (cellValue === transactionId) {
            transactionRowIndex = rowIndex;
            break; // Exit the loop if found
        }
    }

    // If transaction is found, update the Status field
    if (transactionRowIndex !== -1) {
        const statusCellAddress = xlsx.utils.encode_cell({ c: 16, r: transactionRowIndex }); // Assuming Status is in the sixteenth column (index 15)
        worksheet[statusCellAddress] = { v: newStatus, t: 's' }; // Update the status cell
        console.log(`Status for transaction ${transactionId} updated to "${newStatus}".`);
    } else {
        console.log(`Transaction ${transactionId} not found.`);
    }

    // Save the updated workbook
    xlsx.writeFile(workbook, filePath);
}

function createPaymentEmbed(paymentDetails, status) {
    const embed = new EmbedBuilder()
        .setColor(status === 'verified' ? '#00ff00' : status === 'pending' ? '#0099ff' : '#ff0000')
        .setTitle(`Payment ${status === 'verified' ? 'Success' : status === 'pending' ? 'In Progress' : 'Rejection'}`)
        .setDescription(`Details for the payment:`);

    // Add fields if they have values
    if (paymentDetails.transactionId) {
        embed.addFields({ name: 'Transaction ID', value: paymentDetails.transactionId, inline: false });
    }
    if (paymentDetails.roll) {
        embed.addFields({ name: 'Roll Number', value: paymentDetails.roll, inline: false });
    }
    if (paymentDetails.name) {
        embed.addFields({ name: 'Name', value: paymentDetails.name, inline: false });
    }
    if (paymentDetails.Branch) {
        embed.addFields({ name: 'Branch', value: paymentDetails.Branch, inline: false });
    }
    if (paymentDetails.feeType) {
        embed.addFields({ name: 'Fee Type', value: paymentDetails.feeType, inline: false });
    }
    if (paymentDetails.feeYear) {
        embed.addFields({ name: 'Year', value: paymentDetails.feeYear, inline: false });
    }
    if (paymentDetails.feeSem) {
        embed.addFields({ name: 'Semester', value: paymentDetails.feeSem, inline: false });
    }
    if (paymentDetails.amount) {
        embed.addFields({ name: 'Amount', value: `${paymentDetails.amount} INR`, inline: false });
    }
    if (paymentDetails.date) {
        embed.addFields({ name: 'Date', value: paymentDetails.date, inline: true });
    }
    if (paymentDetails.time) {
        embed.addFields({ name: 'Time', value: paymentDetails.time, inline: true });
    }

    embed.setFooter({ text: 'Payment status updated.' });
    return embed;
}

// Function to send payment details for verification
async function sendPaymentForVerification(paymentDetails) {
    try {
        const adminChannel = client.channels.cache.get(FEE_NOTIFY_CHANNEL_ID);
        const embed = createPaymentEmbed(paymentDetails, 'pending');

        const verifyMessage = await adminChannel.send({ embeds: [embed] });
        await verifyMessage.react('✅');
        await verifyMessage.react('❌');

        // Store payment details with the message ID
        paymentDetailsMap[verifyMessage.id] = paymentDetails;
        savePaymentDetails(paymentDetailsMap);
    } catch (error) {
        console.error('Error sending payment for verification:', error);
    }
}

// Handle reaction events
client.on('messageReactionAdd', async (reaction, user) => {
    if (user.bot) return; // Ignore bot reactions
    if (reaction.message.channel.id !== FEE_NOTIFY_CHANNEL_ID) {
        return;
    }

    try {
        const fetchedMessage = await reaction.message.fetch();
        const paymentDetails = paymentDetailsMap[fetchedMessage.id];
        if (!paymentDetails) return;

        let embed;
        let paymentRecord = await Payment.findOne({ Roll: paymentDetails.roll });
        const filePath = 'main.xlsx';
        if (paymentRecord) {
            const transaction = paymentRecord.Payments.find(p => p.transactionId === paymentDetails.transactionId);
            if (reaction.emoji.name === '✅') {
                embed = createPaymentEmbed(paymentDetails, 'verified');
                const verifiedChannel = client.channels.cache.get(VERIFIED_CHANNEL_ID);
                await verifiedChannel.send({ embeds: [embed] });

                if (transaction) {
                    transaction.manual = 'Verified';
                    await updateStatusInExcel(filePath, paymentDetails.transactionId, 'Verified');
                }

                delete paymentDetailsMap[fetchedMessage.id];
                savePaymentDetails(paymentDetailsMap);
            } else if (reaction.emoji.name === '❌') {
                embed = createPaymentEmbed(paymentDetails, 'wrong');
                const rejectChannel = client.channels.cache.get(REJECTED_CHANNEL_ID);
                await rejectChannel.send({ embeds: [embed] });
                
                if (transaction) {
                    transaction.manual = 'Rejected';
                    await updateStatusInExcel(filePath, paymentDetails.transactionId, 'Rejected');
                }
                delete paymentDetailsMap[fetchedMessage.id];
                savePaymentDetails(paymentDetailsMap);
            }

            // Save the updated paymentRecord back to the database
            await Payment.updateOne({ Roll: paymentDetails.roll }, { Payments: paymentRecord.Payments });
        } else {
            console.error("Payment record not found.");
        }
    } catch (error) {
        console.error('Error fetching message or processing reaction:', error);
    }
});

// Handling messages, including DMs
client.on('messageCreate', async (message) => {
    if (message.author.bot) return;

    // Check if the message is in DMs
    const isDM = message.channel.type === 'DM';

    try {
        // Help command
        if (message.content.startsWith('!help')) {
            const helpEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('📚 Help Command')
                .setDescription('Here are the commands you can use:')
                .addFields(
                    { name: '!getpayments <Roll> <DOB (DD-MM-YYYY)>', value: 'Retrieve your transaction details (sent via DM).' }
                )
                .setFooter({ text: 'Need more help? Ask away!' });

            await message.reply({ embeds: [helpEmbed] });
            return;
        }

        if (message.content.startsWith('!chelp')) {
            const adminChannelId = process.env.ADMIN_CHANNEL_ID; // Replace with your channel ID
            if (message.channel.id !== adminChannelId) {
                return message.reply('This command can only be used in the specified channel.');
            }
            const helpEmbed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle('📚 Help Command')
                .setDescription('Here are the commands you can use:')
                .addFields(
                    { name: '!cgettransaction <Roll/Transaction No>', value: 'Retrieve all specified roll transaction/specific transaction' }
                )
                .setFooter({ text: 'Need more help? Ask away!' });

            await message.reply({ embeds: [helpEmbed] });
            return;
        }

        // Handle getpayments command
        if (message.content.startsWith('!getpayments')) {
            const args = message.content.split(' ');
            if (args.length !== 3) {
                await message.delete();
                return message.reply('Usage: !getpayments <Roll> <DOB(DD-MM-YYYY)>');
            }

            const roll = args[1];
            const dob = args[2];
            const dobPattern = /^\d{2}-\d{2}-\d{4}$/; // Date format validation
            await message.delete();
            if (!dobPattern.test(dob)) {
                return message.reply('Invalid date format. Please use DD-MM-YYYY.');
            }

            // Fetch payment record
            let paymentRecord = await Payment.findOne({ Roll: roll, DOB: dob });
            if (paymentRecord) {
                const payments = paymentRecord.Payments;
                const lastPayments = payments.slice(-5);

                const embed = new EmbedBuilder()
                    .setColor('#0099ff')
                    .setTitle(`Payment Transactions for ${paymentRecord.Name}`)
                    .setDescription(`Last 5 Payments: \n`)
                    .setTimestamp();

                if (lastPayments.length > 0) {
                    lastPayments.forEach(payment => {
                        embed.addFields({
                            name: `Transaction ID: ${payment.transactionId}`,
                            value: `
                                **Roll:** ${paymentRecord.Roll}
                                **Amount:** ₹${payment.amount}
                                **Category:** ${payment.feeType}
                                **Year:** ${payment.feeYear}
                                **Status:** ${payment.manual}
                                **Created At:** ${payment.created_at_date} ${payment.created_at_time}
                                **Method:** ${payment.method}
                            `
                        });
                    });
                } else {
                    embed.setDescription(`No transactions found for ${paymentRecord.Name}.`);
                }

                await message.author.send({ embeds: [embed] }); // Send the embed in DMs
            } else {
                await message.author.send(`No transactions found for Roll: ${roll} and DOB: ${dob}.`);
            }
        }

        if (message.content.startsWith('!cgettransaction')) {
            const args = message.content.split(' ');
            if (args.length !== 2) {
                return message.author.send('Usage: !cgettransaction <transactionId or Roll>');
            }

            const inputId = args[1];

            // Check if the command is executed in the specified channel
            const adminChannelId = process.env.ADMIN_CHANNEL_ID;
            if (message.channel.id !== adminChannelId) {
                return message.reply('This command can only be used in the specified channel.');
            }

            let paymentRecord;

            // Check if inputId is a valid number (transaction ID) or contains letters (roll number)
            if (/^\d+$/.test(inputId)) {
                // Input is a transaction ID (numeric)
                paymentRecord = await Payment.findOne({ "Payments.transactionId": inputId });

                if (paymentRecord) {
                    const paymentDetail = paymentRecord.Payments.find(payment => payment.transactionId === inputId);

                    const embed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle(`Transaction Details`)
                        .addFields(
                            { name: 'Student Name', value: paymentRecord.Name || 'N/A', inline: false },
                            { name: 'Roll Number', value: paymentRecord.Roll || 'N/A', inline: false },
                            { name: 'Batch', value: paymentRecord.Batch || 'N/A', inline: false },
                            { name: 'Branch', value: paymentRecord.Branch || 'N/A', inline: false },
                            { name: 'Transaction ID', value: paymentDetail ? paymentDetail.transactionId : 'N/A', inline: false },
                            { name: 'Amount', value: paymentDetail ? `₹${paymentDetail.amount}` : 'N/A', inline: false },
                            { name: 'Status', value: paymentDetail ? paymentDetail.manual : 'N/A', inline: false },
                            { name: 'Fee Type', value: paymentDetail ? paymentDetail.feeType : 'N/A', inline: false },
                            { name: 'Fee Year', value: paymentDetail ? paymentDetail.feeYear : 'N/A', inline: false },
                            { name: 'Created At', value: paymentDetail ? `${paymentDetail.created_at_date} ${paymentDetail.created_at_time}` : 'N/A', inline: false },
                            { name: 'Method', value: paymentDetail ? paymentDetail.method : 'N/A', inline: false },
                        );

                    await message.reply({ embeds: [embed] });
                } else {
                    await message.reply(`No transaction found for ID: ${inputId}.`);
                }
            } else {
                // Input is treated as a roll number (contains letters)
                const paymentRecords = await Payment.find({ Roll: inputId.toUpperCase() }).sort({ createdAt: 1 }).limit(10);

                if (paymentRecords.length > 0) {
                    const embed = new EmbedBuilder()
                        .setColor('#0099ff')
                        .setTitle(`Last 5 Transactions for Roll: ${inputId.toUpperCase()}`)
                        .addFields(
                            { name: 'Student Name', value: paymentRecords[0].Name || 'N/A', inline: true },
                            { name: 'Roll Number', value: paymentRecords[0].Roll || 'N/A', inline: true },
                            { name: 'Batch', value: paymentRecords[0].Batch || 'N/A', inline: true },
                            { name: 'Branch', value: paymentRecords[0].Branch || 'N/A', inline: true }
                        );

                    paymentRecords.forEach((record) => {
                        record.Payments.forEach(payment => {
                            embed.addFields({
                                name: `Transaction ID: ${payment.transactionId}`,
                                value: `Amount: ₹${payment.amount}\n` +
                                        `Status: ${payment ? payment.manual : 'N/A'}\n` +
                                        `Fee Type: ${payment ? payment.feeType : 'N/A'}\n` +
                                        `Fee Year: ${payment ? payment.feeYear : 'N/A'}\n` +
                                        `Fee Sem: ${payment ? payment.feeSem : 'N/A'}\n` +
                                        `Created At: ${payment ? `${payment.created_at_date} ${payment.created_at_time}` : 'N/A'}\n` +
                                        `Method: ${payment ? payment.method : 'N/A'}`,
                                inline: false
                            });
                        });
                    });

                    await message.reply({ embeds: [embed] });
                } else {
                    await message.reply(`No transactions found for Roll: ${inputId}.`);
                }
            }
        }
    } catch (error) {
        console.error('Error handling message:', error);
    }
});

module.exports = {
    sendPaymentForVerification,
};

// Log in the bot
client.login(process.env.DISCORDTOKEN).catch(error => {
    console.error('Error logging in:', error);
});
