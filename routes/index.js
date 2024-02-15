const express = require('express');

// const authRouter = require('./auth');
const filterRouter = require('../routes/filters');

const router = express.Router();

// router.use('/users', authRouter); // Register, login, logout
router.use('/filters', filterRouter);

module.exports = router;
