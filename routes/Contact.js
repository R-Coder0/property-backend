// routes/contact.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');

router.post('/contact', (req, res) => {
  const { name, email, phone, subject, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: 'rishabhpratap008@gmail.com',
    subject: `Contact Form Submission: ${subject}`,
    text: `
      Name: ${name}
      Email: ${email}
      Phone: ${phone}
      Message: ${message}
    `,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log(error);
      res.status(500).send('Something went wrong.');
    } else {
      console.log('Email sent: ' + info.response);
      res.status(200).send('Email sent successfully.');
    }
  });
});

module.exports = router;
