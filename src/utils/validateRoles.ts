import { AuthorityTypes } from '@prisma/client'

export const validateRoles = (rolesArr: AuthorityTypes[]) => {
  const uniqueRoles = new Set(rolesArr)
  const modifiedRoles = [...uniqueRoles]
  return modifiedRoles
}
