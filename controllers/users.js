import { usersModel } from '../Models/users.js'
import { validateUser, validatePartialUser } from '../utils/Schemas/user.js'

export class usersController {
  static async getAll (req, res) {
    const keys = Object.keys(req.query)
    const values = Object.values(req.query)
    const result = await usersModel.getAll(keys, values)

    if (!result) return res.send({ message: 'User not found' }).status(404)
    res.send(result).status(200)
  }

  static async create (req, res) {
    const user = validateUser(req.body)
    if (!user.success) return res.status(400).json({ error: JSON.parse(user.error) })

    const result = await usersModel.create(user.data)
    if (!result) return res.send({ message: 'User already exists' }).status(400)
    res.send(result).status(201)
  }

  static async update (req, res) {
    const user = validatePartialUser(req.body)
    if (!user.success) return res.status(400).json({ error: JSON.parse(user.error.errors) })

    const { ID } = req.params
    const result = await usersModel.update(user.data, ID)

    if (!result) return res.send({ message: 'User not found' }).status(404)
    res.send(result).status(200)
  }

  static async delete (req, res) {
    const { ID } = req.params
    const result = await usersModel.delete(ID)

    if (result === false) return res.status(404).json({ message: 'user not found' })
    return res.json({ message: 'user deleted' }).status(200)
  }
}
