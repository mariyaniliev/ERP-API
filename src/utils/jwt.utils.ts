import jwt, { SignOptions } from 'jsonwebtoken'


export function signJwt(object: Object, options?: SignOptions | undefined) {
  return jwt.sign(object, 'shhhhh', {
    ...(options && options),
  })
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjJkMWRhZmU4ODc5OWI2YjM0Nzg1ZTkiLCJlbWFpbCI6Iml2YW5rcmFldkBhYnYuYmciLCJuYW1lIjoiaXZhbiBrcmFldiIsImNyZWF0ZWRBdCI6IjIwMjItMDMtMTJUMjI6MjQ6NDcuNDUzWiIsInVwZGF0ZWRBdCI6IjIwMjItMDMtMTJUMjI6MjQ6NDcuNDUzWiIsIl9fdiI6MCwic2Vzc2lvbiI6IjYyMmUwMTQ3ZWRkNjcxZjljYTQwOTczMCIsImlhdCI6MTY0NzE4MjE1MSwiZXhwIjoxNjQ3MTgzMDUxfQ.87ql9Bq77U8w_cOFvIPr2El_oWrarkf8uK-Hf7Sn_aU',
      'shhhhh',
    )

    return {
      valid: true,
      expired: false,
      decoded,
    }
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === 'jwt expired',
      decoded: null,
    }
  }
}