import jwt, { SignOptions } from 'jsonwebtoken'
const secret = process.env.JWT_SECRET_KEY as string

export function signJwt(object: Record<string, unknown>, options?: SignOptions | undefined) {
  return jwt.sign(object, secret, {
    ...(options && options),
  })
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, secret)
    console.log(token, secret)

    return {
      valid: true,
      expired: false,
      decoded,
    }
  } catch (error) {
    const typedError = error as Error
    return {
      valid: false,
      expired: typedError?.message === 'jwt expired',
      decoded: null,
    }
  }
}
