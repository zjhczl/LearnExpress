const nodemailer = require("nodemailer");

exports.sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    // host:"",
    // port:"",
    service: "Gmail",
    auth: { user: process.env.EMAIL_USERNAME, pass: EMAIL_PASSWORD },
  });

  const mailOption = {
    from: "zj@qq.com",
    to: options.email,
    subject: options.subject,
    text: options.text,
  };

  await transporter.sendMail(mailOption);
};
