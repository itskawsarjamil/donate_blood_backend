import nodemailer from 'nodemailer';
import config from '../config';

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: config.node_env === 'production',
  auth: {
    user: config.emailSender.email,
    pass: config.emailSender.app_pass,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const sendEmail = async (email: string, html: string) => {
  await transporter.sendMail({
    from: config.emailSender.email,
    to: email,
    subject: 'Change Password in 5min',
    text: '',
    html,
  });
};

export default sendEmail;
