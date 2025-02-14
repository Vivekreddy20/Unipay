const Razorpay = require('razorpay');
const crypto = require('crypto');
const Payment = require('../models/paymentModel');
const FeeDetail = require('../models/feeDetailModel');
const jwt = require('jsonwebtoken');
const { feeAmount, isFeeEnabled, isFeePaid } = require('../Utils/feeUtil');
const students = require('../models/rollDobModel');
const sendSuccessEmail = require('./mailer');
const { sendPaymentForVerification } = require('./discordBot');
const xlsx = require('xlsx');
const fs = require('fs');
const { Console } = require('console');
const mongoose = require('mongoose');


const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
});


function generateTransactionId() {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = String(now.getFullYear()).slice(2); // Last two digits of the year
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  
  return `${day}${month}${year}${hours}${minutes}${seconds}`;
}

const checkout = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    let { Roll, dob, feeType, feeYear, feeSem } = decoded;

    const feeDetails = await FeeDetail.findOne({ Roll, DOB: dob });

    if (feeDetails) {
      const amount = feeAmount(feeDetails, feeType, feeYear, feeSem);

      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };

      const order = await instance.orders.create(options);

      res.status(200).json({ success: true, order });
    } else {
      res.status(404).json({ message: 'Fee details not found' });
    }
  } catch (error) {
    console.error("Error in checkout:", error);
    res.status(500).json({ success: false, error: error.message });
  }
};

const paymentVerification = async (req, res) => {
  console.log("In payment Verification")
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  const body = `${razorpay_order_id}|${razorpay_payment_id}`;
  const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_API_SECRET).update(body).digest("hex");
  if (expectedSignature === razorpay_signature) {
    try {
      const payment = await instance.payments.fetch(razorpay_payment_id);
      const token = req.headers.authorization;
      const decoded = jwt.verify(token, process.env.SECRET_KEY);
      let { Roll, dob, feeType, feeYear, feeSem } = decoded;
      const student = await students.findOne({ Roll, DOB: dob });

      console.log("in PaymentController");
      const transactionId = generateTransactionId(); // Generate transaction ID
      console.log(`Transaction ID: ${transactionId}`);
      const currentDate = new Date().toLocaleDateString('en-IN', { timeZone: 'Asia/Kolkata' });
      const currentTime = new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' });
      const paymentCollection = mongoose.connection.collection('payments'); // Use the correct collection name
      try{
        const transactionData = {
          transactionId: transactionId,
          razorpayOrderId: razorpay_order_id,
          feeType: feeType,
          feeYear: feeYear,
          feeSem: feeSem,
          roll: Roll,
          name: student.Name,
          phone: payment.contact,
          amount: payment.amount / 100,
          date: currentDate,
          time: currentTime
      };
        res.status(200).json(transactionData);
      }catch (error) {
        console.error("Error in payment success response", error);
        res.status(500).json({ success: false, message: "Error in payment success response" });
      }
      try {
        console.log(Roll);
        let paymentRecord = await paymentCollection.findOne({ Roll });

        if (!paymentRecord) {
            // If no payment record exists, create a new one
            const newPaymentRecord = {
                Roll,
                Batch: Roll.substring(0, 2),
                Name: student.Name,
                DOB: student.DOB,
                Branch: student.Branch,
                Section: student.Section,
                phone: payment.contact,
                email: student['student mail id'],
                Payments: [
                    {
                        transactionId,
                        razorpay_order_id,
                        razorpay_payment_id,
                        razorpay_signature,
                        feeType,
                        feeYear,
                        feeSem,
                        amount: payment.amount / 100,
                        status: payment.status,
                        created_at_date: currentDate,
                        created_at_time: currentTime,
                        method: payment.method,
                        card_id: payment.card_id,
                        bank: payment.bank,
                        wallet: payment.wallet,
                        vpa: payment.vpa,
                        description: payment.description,
                    },
                ],
            };

            // Use insertOne to insert the new payment record
            console.log(newPaymentRecord)
            await paymentCollection.insertOne(newPaymentRecord);
        } else {
            // If payment record exists, check if today's transaction ID already exists in Payments array
            const existingPayment = paymentRecord.Payments.find(p => p.transactionId === transactionId);
            
            if (!existingPayment) {
                // Add new payment record for today
                console.log("Adding new payment record for transaction ID:", transactionId);
                paymentRecord.Payments.push({
                    transactionId,
                    razorpay_order_id,
                    razorpay_payment_id,
                    razorpay_signature,
                    feeType,
                    feeYear,
                    feeSem,
                    amount: payment.amount / 100,
                    status: payment.status,
                    created_at_date: currentDate,
                    created_at_time: currentTime,
                    method: payment.method,
                    card_id: payment.card_id,
                    bank: payment.bank,
                    wallet: payment.wallet,
                    vpa: payment.vpa,
                    description: payment.description,
                });

                // Update the existing record
                await paymentCollection.updateOne(
                    { Roll },
                    { $set: { Payments: paymentRecord.Payments } }
                );
            } else {
                console.log("Payment record already exists for transaction ID:", transactionId);
            }
        }
    } catch (error) {
        console.error("Error in updating Payment DB", error);
        res.status(500).json({ success: false, message: "Error updating payment details into payment DB" });
    }
    

      try{
        let feeDetails = await FeeDetail.findOne({ Roll, DOB: dob });
        if (feeDetails) {
          const checkEnabled = isFeeEnabled(feeDetails, feeType, feeYear, feeSem);
          if (checkEnabled) {
            const checkPaid = isFeePaid(feeDetails, feeType, feeYear, feeSem);
            if (!checkPaid) {
              feeDetails.isPaid[feeType][feeYear] = true;
              await feeDetails.save();
            }
          }
        }
      }catch (error) {
        console.error("Error in updating original DB", error);
        res.status(500).json({ success: false, message: "Error in updating original DB" });
      }
      const paymentDetails = {
        transactionId,
        roll: student.Roll,
        name: student.Name,
        Branch: student.Branch,
        feeType,
        feeYear,
        feeSem,
        amount: payment.amount / 100,
        date: currentDate,
        time: currentTime 
      };
      //Excel Updationg
      console.log(currentDate)
      try {
        const filePath = 'main.xlsx'; // Adjust the path to your Excel file
        let workbook;
        
        if (fs.existsSync(filePath)) {
            // If the file exists, read it
            workbook = xlsx.readFile(filePath);
        } else {
            // If the file does not exist, create a new workbook and a new worksheet
            workbook = xlsx.utils.book_new();
            const worksheet = xlsx.utils.aoa_to_sheet([[
                'Date', 'Time', 'TransactionId', 'Razorpay_Order_Id', 'Batch', 
                'Roll', 'Name', 'Branch', 'Section', 'Phone', 'Email', 
                'FeeType', 'FeeYear', 'FeeSem', 'Amount', 'Method', 'Status'
            ]]);
            xlsx.utils.book_append_sheet(workbook, worksheet, 'Payments');
        }
    
        const sheetName = 'Payments';
        const worksheet = workbook.Sheets[sheetName];
    
        // Prepare new row data
        const newRow = {
            Date: currentDate,
            Time: currentTime,
            transactionId,
            razorpay_order_id,
            Batch: Roll.substring(0, 2),
            Roll: student.Roll,
            Name: student.Name,
            Branch: student.Branch,
            Section: student.Section,
            phone: payment.contact,
            email: student['student mail id'],
            FeeType: feeType,
            FeeYear: feeYear,
            FeeSem: feeSem,
            Amount: payment.amount / 100,
            method: payment.method,
            manual: "Verification in progress...",
            Status: payment.status
        };
        console.log("Adding into excel")
    
        // Get the range of existing data or initialize if empty
        const range = worksheet['!ref'] ? xlsx.utils.decode_range(worksheet['!ref']) : { s: { r: 0, c: 0 }, e: { r: 0, c: 0 } };
        console.log(range)
        const newRowIndex = range.e.r + 1; // Add new row after the last one
    
        // Populate the new row in the worksheet
        for (const [key, value] of Object.entries(newRow)) {
            const colIndex = Object.keys(newRow).indexOf(key); // Get column index
            const cellAddress = xlsx.utils.encode_cell({ c: colIndex, r: newRowIndex });
            worksheet[cellAddress] = { v: value, t: typeof value === 'number' ? 'n' : 's' };
        }
    
        // Update the worksheet's range
        worksheet['!ref'] = xlsx.utils.encode_range(range.s, { r: newRowIndex, c: range.e.c });
    
        // Save the updated workbook
        xlsx.writeFile(workbook, filePath);
        
    } catch (error) {
        console.error("Error updating Excel file", error);
    }

      // Mailing
      try{
        sendSuccessEmail(student['student mail id'], paymentDetails)
            .then(() => console.log('Email process completed.'))
            .catch(err => console.error('Email process failed:', err));

      }catch(error){
        console.error("Error sending mail", error);
        res.status(500).json({ success: false, message: "Error sending mail" });
      }

      try{
        sendPaymentForVerification(paymentDetails);
      }catch(error){
        console.error("Error sending discord", error);
      }


    } catch (error) {
      console.error("Error in paymentVerification:", error);
      res.status(500).json({ success: false, message: "Error fetching payment details from Razorpay" });
    }
  } else {
    res.status(400).json({ success: false, message: "Payment verification failed" });
  }
};

module.exports = {
  checkout,
  paymentVerification,
};
