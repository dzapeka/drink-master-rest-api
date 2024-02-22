const express = require('express');

const authMiddleware = require('../middlewares/auth');

const authRouter = require('./auth');
const filterRouter = require('./filters');
const drinkRouter = require('./drinks');
const userRouter = require('./users');

const router = express.Router();

router.use('/auth', authRouter);
router.use('/filters', authMiddleware, filterRouter);
router.use('/drinks', authMiddleware, drinkRouter);
router.use('/users', authMiddleware, userRouter);
router.get('/', (req, res) => {
  res.sendFile('./public/index.html');
});

module.exports = router;
