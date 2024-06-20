import { dishesModel } from '../Models/dishes.js'
import { validateDish, validatePartialDish } from '../utils/Schemas/dish.js'

export class dishesController {
  static async getAll (req, res) {
    const keys = Object.keys(req.query)
    const values = Object.values(req.query)

    const result = await dishesModel.getAll(keys, values)
    if (result.length === 0) return res.status(404).json({ message: 'Dishes not found' })
    res.json(result).status(200)
  }

  static async create (req, res) {
    const dish = validateDish(req.body)
    if (!dish.success) return res.status(400).json(dish.error)

    const result = await dishesModel.create(dish.data)
    if (!result) return res.status(409).json({ message: 'Dish already exists' })

    res.json(result).status(201)
  }

  static async update (req, res) {
    const dish = validatePartialDish(req.body)
    if (!dish.success) return res.status(400).json(dish.error)

    const { ID } = req.params
    const result = await dishesModel.update(dish.data, ID)

    if (!result) return res.status(404).json({ message: 'Dish not found' })
    res.json(result).status(200)
  }

  static async delete (req, res) {
    const { ID } = req.params

    const result = await dishesModel.delete(ID)

    if (!result) return res.status(404).json({ message: 'Dish not found' })
    res.status(200).json({ message: 'Dish deleted' })
  }
}
