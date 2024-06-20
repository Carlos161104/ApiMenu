import Router from 'express'
import { dishesController } from '../controllers/dishes.js'

export const dishesRouter = Router()

// Get all dishes
dishesRouter.get('/', dishesController.getAll)

// Create a new dish
dishesRouter.post('/', dishesController.create)

// Update a dish
dishesRouter.patch('/:ID', dishesController.update)

// Delete a dish
dishesRouter.delete('/:ID', dishesController.delete)
