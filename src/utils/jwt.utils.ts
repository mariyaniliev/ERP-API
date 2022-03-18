import jwt, { SignOptions } from "jsonwebtoken";

export function signJwt(object: Object, options?: SignOptions | undefined) {
  return jwt.sign(object, "shhhhh", {
    ...(options && options),
  });
}

export function verifyJwt(token: string) {
  try {
    const decoded = jwt.verify(token, "shhhhh");

    return {
      valid: true,
      expired: false,
      decoded,
    };
  } catch (error: any) {
    return {
      valid: false,
      expired: error.message === "jwt expired",
      decoded: null,
    };
  }
}
