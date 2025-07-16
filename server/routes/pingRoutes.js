const express = require('express');
const { checkPing } = require('../controllers/pingController');
const router = express.Router();

router.post('/', checkPing);

module.exports = router;
