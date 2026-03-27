const Certificate = require('../models/Certificate');
const xlsx = require('xlsx');
const fs = require('fs');

// @desc    Upload Excel file & store certificates
// @route   POST /api/certificates/upload
// @access  Private/Admin
const uploadCertificates = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an excel file' });
    }

    // Parse Excel File
    const workbook = xlsx.readFile(req.file.path);
    const sheetNameList = workbook.SheetNames;
    const excelData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetNameList[0]]);

    let successCount = 0;
    let errors = [];

    // Validate and save data
    for (let i = 0; i < excelData.length; i++) {
      const row = excelData[i];
      const { certificateId, studentName, domain, startDate, endDate } = row;

      // Basic validation
      if (!certificateId || !studentName || !domain || !startDate || !endDate) {
        errors.push(`Row ${i + 2}: Missing required fields.`);
        continue;
      }

      // Check for duplicate
      const exists = await Certificate.findOne({ certificateId: String(certificateId) });
      if (exists) {
        errors.push(`Row ${i + 2}: Certificate ID ${certificateId} already exists.`);
        continue;
      }

      // Helper to parse dates (Excel dates or strings)
      let parsedStart = new Date(startDate);
      if (isNaN(parsedStart)) {
         // rough handle excel serial dates
         parsedStart = new Date(Math.round((startDate - 25569)*86400*1000));
      }
      
      let parsedEnd = new Date(endDate);
      if (isNaN(parsedEnd)) {
         parsedEnd = new Date(Math.round((endDate - 25569)*86400*1000));
      }

      try {
        await Certificate.create({
          certificateId: String(certificateId),
          studentName,
          domain,
          startDate: parsedStart,
          endDate: parsedEnd,
        });
        successCount++;
      } catch (err) {
        errors.push(`Row ${i + 2}: Failed to save - ${err.message}`);
      }
    }

    // Cleanup file after processing
    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: `Successfully added ${successCount} certificates!`,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error(error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error processing file' });
  }
};

// @desc    Get certificate by ID
// @route   GET /api/certificates/:id
// @access  Public
const getCertificateById = async (req, res) => {
  try {
    const certificate = await Certificate.findOne({ certificateId: req.params.id });

    if (certificate) {
      res.json(certificate);
    } else {
      res.status(404).json({ message: 'Certificate not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Get all certificates
// @route   GET /api/certificates
// @access  Private/Admin
const getCertificates = async (req, res) => {
  try {
    const certificates = await Certificate.find({}).sort({ createdAt: -1 });
    res.json(certificates);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

// @desc    Delete certificate
// @route   DELETE /api/certificates/:id
// @access  Private/Admin
const deleteCertificate = async (req, res) => {
  try {
    const certificate = await Certificate.findById(req.params.id);

    if (certificate) {
      await Certificate.deleteOne({ _id: certificate._id });
      res.json({ message: 'Certificate removed' });
    } else {
      res.status(404).json({ message: 'Certificate not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

module.exports = {
  uploadCertificates,
  getCertificateById,
  getCertificates,
  deleteCertificate,
};
