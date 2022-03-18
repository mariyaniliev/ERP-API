import jwt, { SignOptions } from 'jsonwebtoken'

export function signJwt(object: Record<string, unknown>, options?: SignOptions | undefined) {
  return jwt.sign(object, 'shhhhh', {
    ...(options && options),
  })
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, 'shhhhh')

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
