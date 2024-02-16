const express = require('express');

const authRouter = require('./auth');
const filterRouter = require('./filters');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/filters', filterRouter);

module.exports = router;
