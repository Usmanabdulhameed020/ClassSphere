const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.BREVO_SMTP_HOST,
  port: parseInt(process.env.BREVO_SMTP_PORT),
  secure: process.env.BREVO_SMTP_PORT == 465, // true for 465, false for other ports
  auth: {
    user: process.env.BREVO_SMTP_USER,
    pass: process.env.BREVO_SMTP_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendLoginNotification = async (toEmail, username) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Successful Login - ClassSphere',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0d9488;">Hello ${username},</h2>
        <p>This is a notification that you have successfully logged into your <strong>ClassSphere</strong> account.</p>
        <p>If this wasn't you, please secure your account immediately.</p>
        <br />
        <p>Best regards,</p>
        <p>The ClassSphere Team</p>
      </div>
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log(`Login notification sent to ${toEmail}`);
    console.log('Message ID:', info.messageId);
    console.log('Response:', info.response);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

const sendResetCode = async (toEmail, username, code) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: 'Password Reset Code - ClassSphere',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0d9488;">Hello ${username},</h2>
        <p>You requested a password reset for your <strong>ClassSphere</strong> account.</p>
        <p>Your verification code is:</p>
        <div style="background: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #0d9488; border-radius: 8px;">
          ${code}
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p>If you didn't request this, please ignore this email.</p>
        <br />
        <p>Best regards,</p>
        <p>The ClassSphere Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset code sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending reset code:', error);
  }
};

module.exports = { sendLoginNotification, sendResetCode };
