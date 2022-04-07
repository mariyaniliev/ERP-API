'use strict'
const __importDefault = (this && this.__importDefault) || function (mod) {
  return (mod && mod.__esModule) ? mod : { default: mod }
}
Object.defineProperty(exports, '__esModule', { value: true })
exports.verifyJwt = exports.signJwt = void 0
const jsonwebtoken_1 = __importDefault(require('jsonwebtoken'))
function signJwt (object, options) {
  const secret = process.env.JWT_SECRET_KEY
  return jsonwebtoken_1.default.sign(object, secret, {
    ...(options && options)
  })
}
exports.signJwt = signJwt
function verifyJwt (token) {
  const secret = process.env.JWT_SECRET_KEY
  try {
    const decoded = jsonwebtoken_1.default.verify(token, secret)
    return {
      valid: true,
      expired: false,
      decoded
    }
  } catch (error) {
    const typedError = error
    return {
      valid: false,
      expired: typedError?.message === 'jwt expired',
      decoded: null
    }
  }
}
exports.verifyJwt = verifyJwt
// # sourceMappingURL=jwt.utils.js.map
