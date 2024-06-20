import z from 'zod'

const reviewsSchema = z.object({
  UserID: z.string({
    required_error: 'DisID is required',
    invalid_type_error: 'DisID must be a string'
  }),

  DishID: z.number({
    required_error: 'DishID is required',
    invalid_type_error: 'DishID must be a number'
  }).min(1, 'DishID must be at least 1'),

  Rating: z.number({
    required_error: 'Rating is required',
    invalid_type_error: 'Rating must be a number'
  }).min(1, 'Rating must be at least 1')
    .max(5, 'Rating must be at most 5'),

  Commentary: z.string({
    required_error: 'Review is required',
    invalid_type_error: 'Review must be a string'
  }).min(3, 'Review must be at least 3 characters long')
    .max(255, 'Review must be at most 255 characters long'),

  Likes: z.number({
    required_error: 'Likes is required',
    invalid_type_error: 'Likes must be a number'
  }).default(0)
})

export function validateReview (input) {
  return reviewsSchema.required().safeParse(input)
}

export function validatePartialReview (input) {
  return reviewsSchema.partial().safeParse(input)
}
