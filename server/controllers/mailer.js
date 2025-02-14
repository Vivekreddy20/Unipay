// mailer.js
const nodemailer = require('nodemailer');

// Create a transporter
const transporter = nodemailer.createTransport({
    service: 'gmail', // or your email service
    auth: {
        user: process.env.email, // your email
        pass: process.env.emailPass, // your email password (consider using OAuth2 for production)
    },
});


// Function to send the success email
const sendSuccessEmail = async (to, paymentDetails) => {
    const mailOptions = {
        from: 'samrathreddy04@gmail.com',
        to: to,
        subject: 'Payment Successful!',
        html: `
            <html>
            <head>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        background-color: #f4f4f4;
                        padding: 20px;
                    }
                    .container {
                        background-color: #ffffff;
                        padding: 20px;
                        border-radius: 5px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    }
                    h1 {
                        color: #4CAF50;
                    }
                    .details {
                        margin: 20px 0;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <h1>Payment Successful!</h1>
                    <p>Thank you for your payment.</p>
                    <div class="details">
                        <strong>Payment Details:</strong><br />
                        <strong>Transaction ID:</strong> ${paymentDetails.transactionId}<br />
                        <strong>Date:</strong> ${paymentDetails.date}<br />
                        <strong>Name:</strong> ${paymentDetails.name}<br />
                        <strong>Category :</strong> ${paymentDetails.feeType}<br />
                        <strong>Paid for Year :</strong> ${paymentDetails.feeYear}<br />
                        <strong>Amount:</strong> ₹${paymentDetails.amount}<br />
                    </div>
                    <p>If you have any questions, feel free to reach out to AO Office.</p>
                    <p>Best Regards,<br />Team Unipay</p>
                </div>
            </body>
            </html>
        `,
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
};

module.exports = sendSuccessEmail;
