const express = require('express');

const AuthController = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');
const {
  validateUserRegistration,
  validateUserLogin,
} = require('../middlewares/validateUser');
const router = express.Router();

router.post('/signup', validateUserRegistration, AuthController.register);
router.post('/signin', validateUserLogin, AuthController.login);
router.post('/signout', authMiddleware, AuthController.logout);

module.exports = router;
