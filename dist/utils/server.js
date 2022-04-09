'use strict';
var __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { 'default': mod };
};
Object.defineProperty(exports, '__esModule', { value: true });
const body_parser_1 = __importDefault(require('body-parser'));
const express_1 = __importDefault(require('express'));
const dotenv_1 = __importDefault(require('dotenv'));
const helmet_1 = __importDefault(require('helmet'));
const cors_1 = __importDefault(require('cors'));
const deserializeUser_1 = require('../middleware/deserializeUser');
const routes_1 = __importDefault(require('../routes'));
dotenv_1.default.config();
const corsOptions = {
  origin: 'http://localhost:3000',
};
function createServer() {
  const app = (0, express_1.default)();
  app.use((0, cors_1.default)(corsOptions));
  app.use(body_parser_1.default.urlencoded({ extended: false }));
  app.use(body_parser_1.default.json());
  app.use((0, helmet_1.default)());
  /**
     * * Check if the user provides valid token
     * ? If not
     * ! routes are blocked
     * * by the next middleware which expects user in res.locals
     * ? If valid
     * * user is assigned to res.locals
     */
  app.use(deserializeUser_1.deserializeUser);
  (0, routes_1.default)(app);
  return app;
}
exports.default = createServer;
//# sourceMappingURL=server.js.map