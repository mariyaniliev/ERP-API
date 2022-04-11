'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const nodemailer_1 = __importDefault(require('nodemailer'));
const logger_1 = __importDefault(require('../utils/logger'));
const sendEmail = (targetEmail, subject, text) => {
  const transporter = nodemailer_1.default.createTransport({
    service: 'outlook',
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: targetEmail,
    subject,
    text,
  };
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      logger_1.default.error(err);
    }
    else {
      logger_1.default.info(info);
    }
  });
};
exports.default = sendEmail;
//# sourceMappingURL=sendEmail.js.map