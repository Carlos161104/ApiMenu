import { Router } from 'express'
import { usersController } from '../controllers/users.js'

export const usersRouter = Router()

// obtener usiarios
usersRouter.get('/', usersController.getAll)

// crear un usuario nuevo
usersRouter.post('/', usersController.create)

// modificar un usuario
usersRouter.patch('/:ID', usersController.update)

// eliminar un usuario
usersRouter.delete('/:ID', usersController.delete)
