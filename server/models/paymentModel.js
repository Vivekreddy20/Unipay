const mongoose = require('mongoose');

const paymentDetailSchema = new mongoose.Schema({
  transactionId: { type: String, required: true },
  razorpay_order_id: { type: String, required: true },
  razorpay_payment_id: { type: String, required: true },
  razorpay_signature: { type: String, required: true },
  
  status: { type: String, required: true },
  feeType: { type: String, required: true },
  feeYear: { type: String, required: true },
  feeSem: { type: Number, required: false },
  amount: { type: Number, required: true },
  manual: { type: String, default: "Verification in progress..." },
  status: { type: String, required: true },
  created_at_date: { type: String, required: true },
  created_at_time: { type: String, required: true },
  method: { type: String, required: true },
  card_id: { type: String },
  bank: { type: String },
  wallet: { type: String },
  vpa: { type: String },
  description: { type: String },
});

const paymentSchema = new mongoose.Schema({
    Batch: {
        type: String,
        required: true,
    },
    Roll: {
        type: String,
        required: true,
        unique: true,
    },
    Name: {
        type: String,
        required: true,
    },
    DOB: {
        type: String,
        required: true
    },
    Name: {
        type: String,
        required: true,
    },
    DOB: {
        type: String,
        required: true
    },
    Branch: {
        type: String,
        required: true,
    },
    Section: {
        type: String,
        required: true,
    },
    phone: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
  Payments: [paymentDetailSchema], // Array of payment detail objects
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);

module.exports = Payment;
