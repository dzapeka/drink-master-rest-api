const express = require('express');

const authRouter = require('./auth');
const filterRouter = require('./filters');
const drinkRouter = require('./drinks');

const authMiddleware = require('../middlewares/auth');

const router = express.Router();
router.get('/', (req, res) => {
  res.sendFile('./public/index.html');
});

router.use('/auth', authRouter);
router.use('/filters', authMiddleware, filterRouter);
router.use('/drinks', authMiddleware, drinkRouter);

module.exports = router;
