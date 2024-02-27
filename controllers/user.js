const User = require('../models/user');
const { sendSubscriptionEmail } = require('../services/sendEmail');

async function currentUser(req, res, next) {
  try {
    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }

    res.send({
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      dateOfBirth: user.dateOfBirth,
    });
  } catch (error) {
    next(error);
  }
}

async function updateUser(req, res, next) {
  try {
    const userID = req.user.id;
    const { name } = req.body;
    const updatedInfo = { name };

    if (req.file) {
      updatedInfo.avatarURL = req.file.path;
    }

    const { email, avatarURL, dateOfBirth } = await User.findByIdAndUpdate(
      userID,
      updatedInfo,
      {
        new: true,
      }
    );

    return res.send({
      name,
      email,
      avatarURL,
      dateOfBirth,
    });
  } catch (error) {
    next(error);
  }
}

async function subscribe(req, res, next) {
  try {
    const { email } = req.body;

    const user = await User.findById(req.user.id);

    if (user === null) {
      return res.status(404).send({ message: 'User not found' });
    }

    if (user.subscriptionEmails.includes(email)) {
      return res.status(409).json({
        message: 'Email is already subscribed',
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscriptionEmails: email },
    });

    res.status(204).end();

    await sendSubscriptionEmail(email);
  } catch (error) {
    next(error);
  }
}

module.exports = { currentUser, updateUser, subscribe };
