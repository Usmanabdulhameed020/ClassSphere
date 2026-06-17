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

const sendWelcomeNotification = async (toEmail, username) => {
  const mailOptions = {
    from: `"ClassSphere" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'Welcome to ClassSphere!',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0d9488;">Welcome to ClassSphere, ${username}!</h2>
        <p>Thank you for signing up for <strong>ClassSphere</strong>. We are thrilled to have you join our learning ecosystem.</p>
        <p>Explore your spheres, interact with our AI Assistant, and manage your classes seamlessly.</p>
        <br />
        <p>Best regards,</p>
        <p>The ClassSphere Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome notification sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
  }
};

const sendResetCode = async (toEmail, username, code) => {
  const mailOptions = {
    from: `"ClassSphere" <${process.env.EMAIL_FROM}>`,
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

const sendContactEmail = async ({ firstName, lastName, email, subject, message }) => {
  const mailOptions = {
    from: `"ClassSphere" <${process.env.EMAIL_FROM}>`,
    to: 'classsphere10@gmail.com',
    subject: `New Contact Inquiry: ${subject || 'General'}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0d9488;">New Inquiry from ClassSphere</h2>
        <p><strong>Name:</strong> ${firstName || ''} ${lastName || ''}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subject:</strong> ${subject || 'General Inquiry'}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #0d9488;">
          ${message.replace(/\n/g, '<br />')}
        </div>
        <br />
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="font-size: 11px; color: #888;">This message was generated from the ClassSphere landing page contact form.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact email sent for ${email}`);
  } catch (error) {
    console.error('Error sending contact email:', error);
    throw error;
  }
};

const sendContactAcknowledgement = async (toEmail, firstName) => {
  const mailOptions = {
    from: `"ClassSphere" <${process.env.EMAIL_FROM}>`,
    to: toEmail,
    subject: 'We received your inquiry - ClassSphere',
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #0d9488;">Hello ${firstName || 'there'},</h2>
        <p>Thank you for reaching out to <strong>ClassSphere</strong>.</p>
        <p>We have received your inquiry and our support team is reviewing it. We will get back to you as soon as possible.</p>
        <br />
        <p>Best regards,</p>
        <p>The ClassSphere Team</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact acknowledgement sent to ${toEmail}`);
  } catch (error) {
    console.error('Error sending contact acknowledgement:', error);
  }
};

module.exports = { sendResetCode, sendWelcomeNotification, sendContactEmail, sendContactAcknowledgement };
