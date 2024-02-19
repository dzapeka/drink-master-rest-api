const express = require('express');

const UserController = require('../controllers/user');
const validateSchema = require('../middlewares/validateSchema');
const upload = require('../middlewares/upload');
const { userSubscribeSchema } = require('../schemas/user');

const router = express.Router();

router.get('/current', UserController.currentUser);
router.patch('/update', upload.single('avatar'), UserController.updateUser);
router.post(
  '/subscribe',
  validateSchema(userSubscribeSchema),
  UserController.subscribe
);

module.exports = router;
