const User = require('../models/user');

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
    const avatarURL = req.file.path;
    const { name } = req.body;

    const user = await User.findByIdAndUpdate(
      userID,
      { name, avatarURL },
      {
        new: true,
      }
    );
    return res.send({
      name: user.name,
      email: user.email,
      avatarURL: user.avatarURL,
      dateOfBirth: user.dateOfBirth,
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
      return res.status(400).json({
        message: 'Email is already subscribed',
      });
    }

    await User.findByIdAndUpdate(req.user.id, {
      $push: { subscriptionEmails: email },
    });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { currentUser, updateUser, subscribe };
