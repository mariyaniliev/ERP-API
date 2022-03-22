import { Prisma } from '@prisma/client'

export function errorMessage(error: Prisma.PrismaClientKnownRequestError) {
  return `Error code: ${error.code}. Please check prisma docs for referance: \n https://www.prisma.io/docs/reference/api-reference/error-reference`
}
