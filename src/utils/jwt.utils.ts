import jwt, { SignOptions } from 'jsonwebtoken'

export function signJwt(object: Record<string, unknown>, options?: SignOptions | undefined) {
  const secret = process.env.JWT_SECRET_KEY as string
  return jwt.sign(object, secret, {
    ...(options && options),
  })
}

export function verifyJwt(token: string) {
  const secret = process.env.JWT_SECRET_KEY as string
  try {
    const decoded = jwt.verify(token, secret)

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
