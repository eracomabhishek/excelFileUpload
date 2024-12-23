const express = require('express');
const uploadController = require('../controllers/uploadController');
const {searchUser} = require('../controllers/searchController')
const uploadMiddleware = require('../middleware/fileMiddleware');

const router = express.Router();

// Endpoint to upload Excel file
router.post('/upload', uploadMiddleware, uploadController.uploadFile);

router.get('/search', searchUser)

module.exports = router;
