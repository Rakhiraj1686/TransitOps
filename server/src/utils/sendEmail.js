const nodemailer = require('nodemailer');

// Reads SMTP config from environment variables — set these in your .env file:
//   EMAIL_HOST=smtp.yourprovider.com
//   EMAIL_PORT=587
//   EMAIL_SECURE=false          (true if using port 465)
//   EMAIL_USER=your-smtp-username
//   EMAIL_PASS=your-smtp-password-or-app-key
//   EMAIL_FROM="TransitOps <no-reply@transitops.com>"   (optional, falls back to EMAIL_USER)
//
// Any SMTP provider works here (Gmail app password, SendGrid, Mailgun, AWS SES, etc.) —
// just point EMAIL_HOST/PORT at whichever service you choose.
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Sends an email. Never throws — logs and swallows errors so a failed email
 * (e.g. missing SMTP config) never breaks the calling request (registration, etc.).
 */
const sendEmail = async ({ to, subject, html }) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
      to,
      subject,
      html,
    });

    console.log("✅ Email sent:", info.response);
  } catch (err) {
    console.error("❌ Email Error:", err);
  }
};

module.exports = sendEmail;
