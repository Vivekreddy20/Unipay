require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const limiter = require('./middlewares/rateLimitMiddleware');
const rollRoutes = require('./routes/rollRoute');
const dobRoutes = require('./routes/dobRoute');
const feeRoutes = require('./routes/feeRoute');
const paymentRoutes = require('./routes/paymentRoute');

const path = require('path');


const app = express();
const PORT = process.env.PORT || 8000;

app.set('trust proxy', 1);

app.use(express.static(path.resolve(__dirname,'build')))

// CORS configuration
const corsOptions = {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Handle preflight requests
app.options('*', cors(corsOptions)); // Preflight requests are always OPTIONS

// Apply CORS and JSON body parser middleware
app.use(cors(corsOptions));
app.use(express.json());
app.use(limiter);

connectDB();

app.use('/v1/api/roll', rollRoutes);
app.use('/v1/api/dob', dobRoutes);
app.use('/v1/api/fee', feeRoutes);
app.use('/v1/api/razor/payment', paymentRoutes);
app.use("/v1/api/razor/getkey", (req, res) =>
  res.status(200).json({ key: process.env.RAZORPAY_API_KEY })
);



app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


