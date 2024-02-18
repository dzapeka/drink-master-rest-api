const express = require('express');

const authRouter = require('./auth');
const filterRouter = require('./filters');
const usersRouter = require('./users');

const router = express.Router();

const authMiddleware = require('../middlewares/auth');

router.use('/auth', authRouter);
router.use('/filters', authMiddleware, filterRouter);
router.use('/users', authMiddleware, usersRouter);

module.exports = router;
