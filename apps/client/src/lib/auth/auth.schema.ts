import { z } from 'zod'

export const NAME_MIN = 2
export const NAME_MAX = 10

export const PASSWORD_MIN = 6
export const PASSWORD_MAX = 100
export const PASSWORD_ONE_UPPERCASE_REGEX = /.*[A-Z].*/
export const PASSWORD_ONE_LOWERCASE_REGEX = /.*[a-z].*/
export const PASSWORD_ONE_SPECIAL_REGEX = /.*[!"#$%&'()*+,./:;<=>?@[\\\]^_{|}~-].*/
export const PASSWORD_ONE_NUMBER_REGEX = /.*\d.*/

export const NameSchema = z
  .string()
  .min(NAME_MIN, `Name must be at least ${NAME_MIN} characters`)
  .max(NAME_MAX, `Name must be at most ${NAME_MAX} characters`)
  .trim()

export const FirstNameSchema = z
  .string()
  .min(NAME_MIN, `First name must be at least ${NAME_MIN} characters`)
  .max(NAME_MAX, `First name must be at most ${NAME_MAX} characters`)
  .trim()

export const LastNameSchema = z
  .string()
  .min(NAME_MIN, `Last name must be at least ${NAME_MIN} characters`)
  .max(NAME_MAX, `Last name must be at most ${NAME_MAX} characters`)
  .trim()

export const EmailSchema = z.string().email('Invalid email').trim()

export const PasswordSchema = z
  .string()
  // .regex(
  //   PASSWORD_ONE_UPPERCASE_REGEX,
  //   'Password must contain at least one uppercase letter',
  // )
  // .regex(
  //   PASSWORD_ONE_LOWERCASE_REGEX,
  //   'Password must contain at least one lowercase letter',
  // )
  // .regex(
  //   PASSWORD_ONE_SPECIAL_REGEX,
  //   'Password must contain at least one special character',
  // )
  // .regex(PASSWORD_ONE_NUMBER_REGEX, 'Password must contain at least one number')
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Password must be at most ${PASSWORD_MAX} characters`)
  .trim()

export const SignUpSchema = z
  .object({
    firstName: FirstNameSchema,
    lastName: LastNameSchema,
    email: EmailSchema,
    password: PasswordSchema,
    passwordConfirm: PasswordSchema,
  })
  .refine(values => values.password === values.passwordConfirm, {
    path: ['passwordConfirm'],
    message: 'Passwords must match',
  })

export const SignInSchema = z.object({
  email: EmailSchema,
  password: PasswordSchema,
})

export const codeQuerySearchParam = 'code'
export const targetQuerySearchParam = 'target'
export const typeQuerySearchParam = 'type'
export const redirectToQuerySearchParam = 'redirectTo'

export const VerifySchema = z.object({
  code: z.coerce.string().length(6, 'Verification code must be 6 digits'),
  type: z.enum(['sign-in', 'email-verification', 'forget-password']),
})
