import { Router } from 'express'
import { reviewsController } from '../controllers/reviews.js'

export const reviewsRouter = Router()

// Get all reviews and get revioew by query
reviewsRouter.get('/', reviewsController.getAll)

reviewsRouter.post('/', reviewsController.create)

reviewsRouter.patch('/:ID', reviewsController.update)

reviewsRouter.delete('/:ID', reviewsController.delete)
