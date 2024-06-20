import z from 'zod'

const dishSchema = z.object({
  Name: z.string({
    invalid_type_error: 'Name must be a string',
    required_error: 'Name is required'
  }).min(3, 'Name must be at least 3 characters long'),
  Description: z.string({
    invalid_type_error: 'Description must be a string',
    required_error: 'Description is required'
  }).min(3, 'Description must be at least 3 characters long')
    .max(255, 'Description must be at most 255 characters long'),
  Price: z.number({
    invalid_type_error: 'Price must be a number',
    required_error: 'Price is required'
  }).min(0, 'Price must be at least 0')
    .refine((price) => /^(\d+(\.\d{2})?)$/.test(price.toString()), {
      message: 'El precio debe tener máximo y mínimo de dos dígitos después del punto decimal.'
    })
    .default(0),
  Category: z.string({
    invalid_type_error: 'Category must be a string',
    required_error: 'Category is required'
  }).min(3, 'Category must be at least 3 characters long'),
  Photography: z.string({
    invalid_type_error: 'Photography must be a string',
    required_error: 'Photography is required'
  }).min(3, 'Photography must be at least 3 characters long')
})

export function validateDish (input) {
  return dishSchema.required().safeParse(input)
}

export function validatePartialDish (input) {
  return dishSchema.partial().safeParse(input)
}
