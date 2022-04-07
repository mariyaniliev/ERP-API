'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
const swagger_ui_express_1 = __importDefault(require('swagger-ui-express'))
const swagger_1 = __importDefault(require('../swagger'))
/**
 * ! Controllers
 */
const celebration_route_1 = __importDefault(require('./celebration.route'))
const lead_route_1 = __importDefault(require('./lead.route'))
const timeoff_route_1 = __importDefault(require('./timeoff.route'))
const user_route_1 = __importDefault(require('./user.route'))
const session_route_1 = __importDefault(require('./session.route'))
/**
 * ! Middlewares
 */
const requireUser_1 = require('../middleware/requireUser')
function routes (app) {
  // * CHECKS IF SERVER IS UP
  app.get('/healthcheck', (req, res) => {
    res.sendStatus(200)
  })
  // * SWAGGER DOCUMENTATION
  app.use('/docs', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_1.default))
  // ! AUTHENTICATION
  app.use(user_route_1.default)
  app.use(session_route_1.default)
  // ! RESOURCES
  app.use(requireUser_1.requireUser, timeoff_route_1.default)
  app.use(requireUser_1.requireUser, lead_route_1.default)
  app.use(requireUser_1.requireUser, celebration_route_1.default)
}
exports.default = routes
// # sourceMappingURL=index.js.map
