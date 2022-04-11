'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const sendEmail_1 = __importDefault(require('./sendEmail'));
const client_1 = __importDefault(require('../utils/client'));
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
  const subject = 'Happy Birthday';
  const text = 'This email aims to congratulate a user for his/her birthday';
  const users = await client_1.default.user.findMany({
    where: { NOT: [{ birthday: null }] },
    select: { birthday: true, email: true },
  });
  users.forEach((user) => {
    if (user.birthday && isTodayBirthday(user.birthday)) {
      (0, sendEmail_1.default)(user.email, subject, text);
    }
  });
};
exports.default = checkUsersForBirthdays;
//# sourceMappingURL=birthdayEmail.js.map