const express = require('express');

const authRouter = require('./auth');
const filterRouter = require('./filters');

const router = express.Router();

const authMiddleware = require('../middlewares/auth');

router.use('/auth', authRouter);
router.use('/filters', authMiddleware, filterRouter);

module.exports = router;
