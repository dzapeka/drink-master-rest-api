const express = require('express');

const AuthController = require('../controllers/auth');
const authMiddleware = require('../middlewares/auth');
const validateSchema = require('../middlewares/validateSchema');
const { userRegistrationSchema, userLoginSchema } = require('../schemas/user');

const router = express.Router();

router.post(
  '/signup',
  validateSchema(userRegistrationSchema),
  AuthController.register
);
router.post('/signin', validateSchema(userLoginSchema), AuthController.login);
router.post('/signout', authMiddleware, AuthController.logout);

module.exports = router;
