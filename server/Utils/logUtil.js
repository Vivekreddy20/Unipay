const fs = require('fs');
const path = require('path');

const logEntry = (filename, entry) => {
  fs.appendFile(path.join(__dirname, filename), entry, (err) => {
    if (err) {
      console.error('Error appending to log file:', err);
    }
  });
};

module.exports = logEntry;
