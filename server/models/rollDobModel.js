const { Console } = require('console');
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  Roll: String,
  Name: String,
  DOB: String,
  Section: String,
  'Current Year' : String,
  'Current Sem' : String,
  Branch : String,
  'Student Mobile No' : Number,
  'student mail id' : String
});

const validate = mongoose.model('2021students', studentSchema);



module.exports = validate;
