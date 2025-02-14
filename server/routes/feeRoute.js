const express = require('express');
const FeeDetail = require('../models/feeDetailModel');
const jwt = require('jsonwebtoken');
const authenticateJWT = require('../middlewares/authMiddleware');
const students = require('../models/rollDobModel');
const formatDate = require('../Utils/formatDate');
const router = express.Router();

const SECRET_KEY = process.env.SECRET_KEY;

const isFeeEnabled = (feeDetails, feeType, year, semester) => {
  const isEnabled = feeDetails.isEnabled;
  if (feeType === 'CollegeFee' || feeType === 'TransportFee') {
    console.log("Original in DB FeeEnabled:", isEnabled[feeType][year]);
    return isEnabled[feeType][year];
  } else if (feeType === 'RegularFee' || feeType === 'SupplyFee' || feeType === 'Re-Evaluation') {
    const yearSem = year + "-" + semester;
    console.log("Original in DB FeeEnabled:", isEnabled[feeType][yearSem]);
    return isEnabled[feeType][yearSem];
  }
  return false;
};

const isFeePaid = (feeDetails, feeType, year, semester) => {
  const isPaid = feeDetails.isPaid;
  if (feeType === 'CollegeFee' || feeType === 'TransportFee') {
    return isPaid[feeType][year];
  } else if (feeType === 'RegularFee' || feeType === 'SupplyFee' || feeType === 'Re-Evaluation') {
    const yearSem = year + "-" + semester;
    return isPaid[feeType][yearSem];
  }
  return false;
};

const feeAmount = (feeDetails, feeType, year, semester) => {
  const FeeAmount = feeDetails.FeeAmount;
  let amount = 0;
  if (feeType === 'CollegeFee' || feeType === 'TransportFee') {
    amount = FeeAmount[feeType][year];
  } else if (feeType === 'RegularFee' || feeType === 'SupplyFee' || feeType === 'Re-Evaluation') {
    const yearSem = year + "-" + semester;
    amount = FeeAmount[feeType][yearSem];
  }
  return amount;
};

// Check fee status
router.post('/check', async (req, res) => {
  let { rollNumber, dob, feeType, year, semester } = req.body;
  dob = formatDate(dob);
  try {
    console.log({ rollNumber, dob, feeType, year, semester });
    // Check if fee details exist for the provided parameters revalidating again just in case if some attacker tries
    const feeDetails = await FeeDetail.findOne({ Roll: rollNumber, DOB: dob });

    if (feeDetails) {
      console.log("Success DOB");

      // Check if the fee is enabled
      const checkEnabled = isFeeEnabled(feeDetails, feeType, year, semester);
      if (checkEnabled) {
        // Check if the fee is paid
        const checkPaid = isFeePaid(feeDetails, feeType, year, semester);

        if (!checkPaid) {
          // Find student details
          const student = await students.findOne({ Roll: rollNumber, DOB: dob });
          if (student) {
            const token = jwt.sign(
              {
                Roll: rollNumber,
                dob: dob,
                feeType: feeType,
                feeYear: year,
                feeSem: semester,
              },
              SECRET_KEY,
              { algorithm: 'HS256', expiresIn: '5m' }
            );

            res.status(200).json({ token });
          } else {
            res.status(404).json({ message: 'Student details issue, raise a complaint' });
          }
        } else {
          res.status(409).json({ message: 'Already paid' }); // 409 Conflict for already paid
        }
      } else {
        res.status(403).json({ message: 'Oops! This fee option is not yet enabled' }); // 403 Forbidden for not enabled
      }
    } else {
      res.status(404).json({ message: 'Fee details not found for the provided roll number or mismatch of DOB' });
    }
  } catch (error) {
    console.error('Error checking fee option:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/verify', authenticateJWT, async (req, res) => {
  try {
    // Assuming req.user contains the user data from the token
    const { Roll, dob, feeType, feeYear, feeSem } = req.user;

    const student = await students.findOne({ Roll, DOB: dob });
    // Query the database using Roll and dob
    const feeDetails = await FeeDetail.findOne({ Roll, DOB: dob });

    if (student && feeDetails) {
      // Get the fee amount
      const amount = feeAmount(feeDetails, feeType, feeYear, feeSem);

      // If student found, return student data
      res.status(200).json({
        Roll: Roll,
        Name: student.Name,
        DOB: dob,
        Branch: student.Branch,
        Section: student.Section,
        feeType: feeType,
        feeYear: feeYear,
        feeSem: feeSem,
        CurrentYear: student['Current Year'], // Enclosed in square brackets or quotes
        CurrentSem: student['Current Sem'], // Enclosed in square brackets or quotes
        StudentMobileNo: student['Student Mobile No'], // Enclosed in square brackets or quotes
        studentMailId: student['student mail id'],
        fee: amount
      });
      console.log("Verified")
    } else {
      // If student not found, return appropriate message
      res.status(404).json({ message: 'Student or fee details not found' });
    }
  } catch (error) {
    console.error('Error fetching student data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/update', authenticateJWT, async (req, res) => {
  const { Roll, dob } = req.user;
  
  try {
    const student = await students.findOne({ Roll, DOB: dob });
    console.log("In updation")
    console.log(student['student mail id'])
    const email = student['student mail id'];
    if (student && (!email || email === "NaN")) {
        console.log("In updation: updating email");
        student['student mail id'] = req.body.Email;
        console.log(req.body.Email);
        await student.save();
    }
    res.status(200).json("Ok Time for payment");
  } catch (error) {
    console.error(error);
    res.status(500).json("An error occurred while updating the student.");
  }
});

module.exports = router;
