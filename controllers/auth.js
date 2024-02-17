const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const register = async (req, res, next) => {
  const { name, email, password, dateOfBirth } = req.body;

  try {
    const user = await User.findOne({ email });
    if (user !== null) {
      return res.status(409).send({ message: 'Email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const result = await User.create({
      name,
      email,
      password: passwordHash,
      dateOfBirth,
    });

    res.status(201).send({
      user: {
        name: result.name,
        email: result.email,
        dateOfBirth: result.dateOfBirth,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user === null) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch === false) {
      return res.status(401).send({ message: 'Email or password is wrong' });
    }

    const token = jwt.sign(
      { id: user._id, name: user.name },
      process.env.JWT_SECRET,
      { expiresIn: '21 days' }
    );

    await User.findByIdAndUpdate(user._id, {
      token,
    });

    res.send({
      token,
      user: {
        name: user.name,
        email: user.email,
        dateOfBirth: user.dateOfBirth,
      },
    });
  } catch (error) {
    next(error);
  }
};

async function logout(req, res, next) {
  try {
    await User.findByIdAndUpdate(req.user.id, { token: null });

    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout };
