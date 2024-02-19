const express = require('express');

const authRouter = require('./auth');
const filterRouter = require('./filters');
const drinkRouter = require('./drinks');

const authMidelware = require('../middlewares/auth');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/filters', authMidelware, filterRouter);
router.use('/drinks', authMidelware, drinkRouter);

module.exports = router;
