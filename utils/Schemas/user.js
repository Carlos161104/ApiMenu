import z from 'zod'

const userSchema = z.object({
  Name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required'
  }).min(3, 'Name must be at least 3 characters long'),
  Email: z.string({
    invalid_type_error: 'Email must be a string',
    required_error: 'Email is required'
  }).email('Invalid email format'),
  password: z.string({
    invalid_type_error: 'Password must be a string',
    required_error: 'Password is required'
  }).min(8, 'Password must be at least 8 characters long'),
  isAdmin: z.boolean({
    invalid_type_error: 'isAdmin must be a boolean',
    required_error: 'isAdmin is required'
  })
})

export function validateUser (user) {
  return userSchema.required().safeParse(user)
}
export function validatePartialUser (user) {
  return userSchema.partial().safeParse(user)
}
