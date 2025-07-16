const express = require('express');
const { shortenUrl, redirectUrl, getUrlStats } = require('../controllers/urlController');
const { getAllUrls } = require('../controllers/urlController');
const adminAuth = require('../middlewares/adminAuth');
const router = express.Router();

router.post('/shorten', shortenUrl);
router.get('/:code', redirectUrl);
router.get('/stats/:code', getUrlStats);
router.get('/admin/all', adminAuth, getAllUrls);
module.exports = router;
