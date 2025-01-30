// const nodemailer = require("nodemailer");
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "biton123654@gmail.com",
        pass: "jcdkwjciukkacxlk",
    },
});

// module.exports = transporter;
export default transporter;
