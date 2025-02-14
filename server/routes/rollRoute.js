const express = require('express');
const validate = require('../models/rollDobModel');
const logEntry = require('../Utils/logUtil');
const validateInput = require('../middlewares/validateInputMiddleware');

const router = express.Router();

router.post('/', async (req, res) => {
  const { rollNumber } = req.body;
  if (!validateInput(rollNumber)) {
    return res.status(400).json({ message: "Invalid roll number format." });
  }

  const log = `${new Date().toISOString()} - IP: ${req.ip}, Roll Number: ${rollNumber}\n`;
  logEntry('../logs/roll-number-log.txt', log);

  try {  
    const student = await validate.findOne({ Roll: rollNumber });
    if (student) {
      return res.status(200).json({ message: 'Success' });
    } else {
      return res.status(404).json({ message: 'Roll number doesn\'t exist.' });
    }
  } catch (error) {
    return res.status(500).json({ message: 'Internal server error' });
  }
});

module.exports = router;
