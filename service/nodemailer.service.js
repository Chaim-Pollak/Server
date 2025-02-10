import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  pool: true,
  host: process.env.HOST,
  port: 465,
  secure: true,
  auth: {
    user: process.env.AUTH_USER,
    pass: process.env.AUTH_PASSWORD,
  },
});

export default transporter;
