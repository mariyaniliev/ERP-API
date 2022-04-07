"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const logger_1 = __importDefault(require("../utils/logger"));
const client_1 = __importDefault(require("../utils/client"));
const sendBirthdayEmail = (targetEmail) => {
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
        subject: 'Happy Birthday',
        text: 'This email aims to congratulate a user for his/her birthday',
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
const isTodayBirthday = (userBirthday) => {
    const date1 = new Date(userBirthday);
    const date2 = new Date();
    const birthdayFormatDate1 = `${date1.getMonth() + 1}/${date1.getDate()}`;
    const birthdayFormatDate2 = `${date2.getMonth() + 1}/${date2.getDate()}`;
    if (birthdayFormatDate1 === birthdayFormatDate2) {
        return true;
    }
    return false;
};
const checkUsersForBirthdays = async () => {
    const users = await client_1.default.user.findMany({
        where: { NOT: [{ birthday: null }] },
        select: { birthday: true, email: true },
    });
    users.forEach((user) => {
        if (user.birthday && isTodayBirthday(user.birthday)) {
            sendBirthdayEmail(user.email);
        }
    });
};
exports.default = checkUsersForBirthdays;
//# sourceMappingURL=birthdayEmail.js.map