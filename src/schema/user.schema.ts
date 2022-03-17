import { object, string, TypeOf } from 'zod'

export const createUserSchema = object({
  body: object({
    name: string({
      required_error: 'Name is required',
    }),
    password: string({
      required_error: 'Password is required',
    }).min(6, 'Password too short - min 6 chars'),
    email: string({ required_error: 'Email is required' }).email(
      'Not a valid email',
    ),
  }),
})

export type CreateUserInput = Omit<
  TypeOf<typeof createUserSchema>,
  'body.passwordConfirmation'
>
