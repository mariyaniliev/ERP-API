"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./utils/logger"));
const server_1 = __importDefault(require("./utils/server"));
const birthdayEmail_1 = __importDefault(require("./emails/birthdayEmail"));
const node_cron_1 = __importDefault(require("node-cron"));
const app = (0, server_1.default)();
const port = Number(process.env.PORT) || 3000;
const baseUrl = process.env.BASE_URL || 'http://localhost';
app.listen(port, '0.0.0.0', () => {
    logger_1.default.info(`App is running at ${baseUrl}:${port}`);
    logger_1.default.info(`Swagger docs avaiable at ${baseUrl}:${port}/docs`);
});
// * Checks every day if user has birthday and send email if so
node_cron_1.default.schedule('0 0 10 * * *', () => {
    (0, birthdayEmail_1.default)();
});
//# sourceMappingURL=app.js.map