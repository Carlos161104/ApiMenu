import { reviewsModel } from '../Models/reviews.js'
import { validateReview, validatePartialReview } from '../utils/Schemas/reviews.js'

export class reviewsController {
  static async getAll (req, res) {
    const keys = Object.keys(req.query)
    const values = Object.values(req.query)
    const result = await reviewsModel.getAll(keys, values)
    return res.json(result).status(200)
  }

  static async create (req, res) {
    const data = validateReview(req.body)
    if (!data.success) return res.status(400).json(data.error)

    const result = await reviewsModel.create(data.data)
    return res.json(result).status(201)
  }

  static async update (req, res) {
    const data = validatePartialReview(req.body)
    if (!data.success) return res.status(400).json(data.error)

    const { ID } = req.params
    const result = await reviewsModel.update(data.data, ID)

    if (!result) return res.status(404).json({ message: 'Review not found' })
    return res.json(result).status(200)
  }

  static async delete (req, res) {
    const { ID } = req.params
    const result = await reviewsModel.delete(ID)

    if (!result) {
      return res.status(404).json({ message: 'Review not found' })
    } else {
      return res.json({ message: 'Review deleted successfully' })
    }
  }
}
