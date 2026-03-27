const express = require('express');
const router = express.Router();
const {
  uploadCertificates,
  getCertificateById,
  getCertificates,
  deleteCertificate,
} = require('../controllers/certificateController');
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Public route for verification
router.route('/:id').get(getCertificateById);

// Protected Admin routes
router.route('/')
  .get(protect, admin, getCertificates);

router.route('/upload')
  .post(protect, admin, upload.single('file'), uploadCertificates);

router.route('/:id')
  .delete(protect, admin, deleteCertificate);

module.exports = router;
