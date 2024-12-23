const xlsx = require('xlsx');
const User = require('../model/user');

const uploadFile = async (req, res) => {
  try {
    // Check if file is uploaded
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    // Read the uploaded Excel file
    const filePath = req.file.path;
    const workbook = xlsx.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert Excel sheet to JSON
    const data = xlsx.utils.sheet_to_json(worksheet);

    // Validate all rows before saving any data
    const idNumbers = new Set();
    const lotteryNumbers = new Set();

    for (let index = 0; index < data.length; index++) {
      const record = data[index];
      const { idNumber, name, lotteryNumber } = record;

      // Check if the required fields are available and not empty
      if (!idNumber || !name || !lotteryNumber) {
        return res.status(400).json({
          error: `Missing required fields in data at row ${index + 1}`,
          row: record, // Send the problematic row data for debugging
        });
      }

      // Check for duplicate idNumber or lotteryNumber in the uploaded file
      if (idNumbers.has(idNumber)) {
        return res.status(400).json({
          error: `Duplicate idNumber found in data at row ${index + 1}`,
          row: record,
        });
      }

      if (lotteryNumbers.has(lotteryNumber)) {
        return res.status(400).json({
          error: `Duplicate lotteryNumber found in data at row ${index + 1}`,
          row: record,
        });
      }

      // Check for duplicate idNumber or lotteryNumber in the database
      const existingUser = await User.findOne({
        $or: [{ idNumber }, { lotteryNumber }],
      });
      if (existingUser) {
        return res.status(400).json({
          error: `Duplicate idNumber or lotteryNumber already exists in the database at row ${index + 1}`,
          row: record,
        });
      }

      // Add to the sets for uniqueness validation
      idNumbers.add(idNumber);
      lotteryNumbers.add(lotteryNumber);
    }

    // Save each valid record to MongoDB
    for (const record of data) {
      const { idNumber, name, lotteryNumber } = record;

      const newUser = new User({
        idNumber,
        name,
        lotteryNumber
      });

      await newUser.save();
    }

    return res.status(200).json({ message: 'File uploaded and data saved successfully' });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadFile,
};






// const xlsx = require('xlsx');
// const User = require('../model/user');

// const uploadFile = async (req, res) => {
//   try {
//     // Check if file is uploaded
//     if (!req.file) {
//       return res.status(400).json({ error: 'No file uploaded' });
//     }

//     // Read the uploaded Excel file
//     const filePath = req.file.path;
//     const workbook = xlsx.readFile(filePath);
//     const sheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[sheetName];
    
//     // Convert Excel sheet to JSON
//     const data = xlsx.utils.sheet_to_json(worksheet);

//     // Validate all rows before saving any data
//     for (let index = 0; index < data.length; index++) {
//       const record = data[index];
//       const { idNumber, name, lotteryNumber } = record;

//       // Check if the required fields are available and not empty
//       if (!idNumber || !name || !lotteryNumber) {
//         return res.status(400).json({
//           error: `Missing required fields in data at row ${index + 1}`,
//           row: record, // Send the problematic row data for debugging
//         });
//       }
//     }

//     // Save each valid record to MongoDB
//     for (const record of data) {
//       const { idNumber, name, lotteryNumber } = record;

//       const newUser = new User({
//         idNumber,
//         name,
//         lotteryNumber
//       });

//       await newUser.save();
//     }

//     return res.status(200).json({ message: 'File uploaded and data saved successfully' });
//   } catch (error) {
//     return res.status(500).json({ error: error.message });
//   }
// };

// module.exports = {
//   uploadFile
// };
