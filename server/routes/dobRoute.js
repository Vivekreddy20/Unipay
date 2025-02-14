const express = require('express');
const jwt = require('jsonwebtoken');
const validate = require('../models/rollDobModel');
const logEntry = require('../Utils/logUtil');
const formatDate = require('../Utils/formatDate');
const validateInput = require('../middlewares/validateInputMiddleware');

const router = express.Router();
const SECRET_KEY = process.env.SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('SECRET_KEY environment variable is not set');
}

router.post('/', async (req, res) => {
  const { rollNumber, dob } = req.body;

  if (!validateInput(rollNumber)) {
    return res.status(400).json({ message: 'Invalid roll number format.' });
  }

  const log = `${new Date().toISOString()} - IP: ${req.ip}, Roll Number: ${rollNumber}, DOB: ${dob}\n`;
  logEntry('../logs/dob-log.txt', log);

  try {
    const student = await validate.findOne({ Roll: rollNumber });

    if (student) {
      if (student.DOB === formatDate(dob)) {
        return res.status(200).json({ message: 'DOB matches' });
      } else {
        return res.status(404).json({ message: 'DOB does not match', test: formatDate(dob) });
      }
    } else {
      return res.status(404).json({ message: 'Roll number not found.' });
    }
  } catch (error) {
    console.error('Error validating roll number and DOB:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
