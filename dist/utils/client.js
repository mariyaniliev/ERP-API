'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const client_1 = require('@prisma/client');
const calculateTimeOffDays_1 = require('./calculateTimeOffDays');
const bcrypt_1 = __importDefault(require('bcrypt'));
const logger_1 = __importDefault(require('../utils/logger'));
const prisma = new client_1.PrismaClient();
prisma.$use(async (params, next) => {
  if ((params.action === 'create' || params.action === 'update') &&
        params.model === 'User' &&
        params.args.data.password) {
    const saltRounds = Number(process.env.SALT_ROUNDS);
    const salt = await bcrypt_1.default.genSalt(saltRounds);
    const password = bcrypt_1.default.hashSync(params.args.data.password, salt);
    params.args.data.password = password;
  }
  // * If we create new time off, we calculate how many days we should subtract from user's remaining time off days
  if (params.action === 'create' && params.model === 'TimeOff') {
    const startDate = params.args.data.startDate;
    const endDate = params.args.data.endDate;
    const timeOffDays = await (0, calculateTimeOffDays_1.calculateTimeOffDays)(startDate, endDate);
    if (timeOffDays === 0) {
      throw new Error('You are trying to book 0 days.\nPlease check if requested dates are business days');
    }
    const userId = params.args.data.user.connect.id;
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (user) {
      if (user.timeOffRemainingDays - timeOffDays <= 0) {
        throw new Error('Remaining time off days are not enough!');
      }
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { timeOffRemainingDays: user.timeOffRemainingDays - timeOffDays },
      });
      logger_1.default.info(`${updatedUser.name} day off remaining days are now ${updatedUser.timeOffRemainingDays}`);
    }
  }
  return next(params);
});
exports.default = prisma;
//# sourceMappingURL=client.js.map