const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.SMTP_SERVER,
  port: process.env.SMTP_PORT || 2525,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

function sendEmail(message) {
  return transport.sendMail(message);
}

function sendSubscriptionEmail(recipient) {
  const message = {
    to: recipient,
    from: process.env.EMAIL_USER,
    subject: 'Drink Master Subscription Confirmation',
    html: SUBSCRIPTION_MAIL_CONTENT,
    text: `Welcome to Drink Master! Thank you for subscribing to our newsletter. You're now part of our community of cocktail enthusiasts. Thank you, The Drink Master Team`,
  };
  return sendEmail(message);
}

const SUBSCRIPTION_MAIL_CONTENT = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Drink Master Subscription Confirmation</title>
  <style>
    p {
      margin-bottom: 15px;
    }
  </style>
</head>
<body>

  <div class="container">
    <h2>Subscription Confirmation</h2>
    <p>Welcome to Drink Master!</p>
    <p>Thank you for subscribing to our newsletter. You're now part of our community of cocktail enthusiasts.</p>
    <p>Thank you,<br> The Drink Master Team</p>
  </div>

</body>
</html>
`;

module.exports = { sendSubscriptionEmail };
