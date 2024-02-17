const express = require('express');
const router = express.Router();
const { getMainPage } = require('../controllers/drinks');

router.get('/mainpage/:quantity', getMainPage);

module.exports = router;
