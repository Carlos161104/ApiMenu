import mysql2 from 'mysql2/promise'
import config from '../config.js'
import { checkUserAndDishExistence } from '../utils/updateConfirm.js'

const connect = await mysql2.createConnection(config)

export class reviewsModel {
  static async getAll (keys, values) {
    try {
      if (keys.length > 0) {
        const placeholders = (keys[0] === 'ID') || (keys[0] === 'UserID')
          ? `${keys} = UUID_TO_BIN(?)`
          : `${keys} = ?`

        const sqlQuery = `SELECT BIN_TO_UUID(ID) ID, BIN_TO_UUID(UserID) UserID, DishID, Commentary, Rating, Likes 
        FROM reviews WHERE ${placeholders}`

        const [rows] = await connect.query(sqlQuery, [values])

        if (rows.length === 0) return { message: 'Review not found' }
        return rows
      }

      const [rows] = await connect.execute(`
        SELECT BIN_TO_UUID(ID) ID, BIN_TO_UUID(UserID) UserID, DishID, Commentary, Rating, Likes FROM reviews
      `)
      return rows
    } catch (error) {
      return { message: error.message }
    }
  }

  static async create (data) {
    try {
      const {
        UserID, DishID, Rating, Commentary, Likes
      } = data
      const [uuidResult] = await connect.query('SELECT UUID() uuid;')
      const [{ uuid }] = uuidResult

      const exists = await checkUserAndDishExistence(UserID, DishID)
      if (!exists) return { message: 'User or Dish not found' }

      await connect.query(
        `INSERT INTO reviews (ID, UserID, DishID, Rating, Commentary, Likes)
        VALUES (UUID_TO_BIN(?), UUID_TO_BIN(?), ?, ?, ?, ?)`, [uuid, UserID, DishID, Rating, Commentary, Likes])

      const [rows] = await connect.query(
        `SELECT BIN_TO_UUID(ID) ID, BIN_TO_UUID(UserID) UserID, DishID, Commentary, Rating, Likes 
        FROM reviews WHERE ID = UUID_TO_BIN(?)`, [uuid])
      return rows
    } catch (error) {
      return { message: error.message }
    }
  }

  static async update (data, ID) {
    try {
      const [info] = await connect.query(
        `SELECT BIN_TO_UUID(ID) ID, BIN_TO_UUID(UserID) UserID, DishID, Commentary, Rating, Likes
        FROM reviews WHERE ID = UUID_TO_BIN(?)`, [ID]
      )
      if (info.length === 0) return false
      const exists = await checkUserAndDishExistence(data.UserID, data.DishID)
      if (!exists) return { message: 'User or Dish not found' }
      await connect.query(
        'UPDATE reviews SET ? WHERE ID = UUID_TO_BIN(?)', [data, ID]
      )

      const [rows] = await connect.query(
        `SELECT BIN_TO_UUID(ID) ID, BIN_TO_UUID(UserID) UserID, DishID, Commentary, Rating, Likes
        FROM reviews WHERE ID = UUID_TO_BIN(?)`, [ID]
      )

      return rows
    } catch (error) {
      return { message: error.message }
    }
  }

  static async delete (ID) {
    try {
      const [info] = await connect.query(
        'SELECT BIN_TO_UUID(ID) ID FROM reviews WHERE ID = UUID_TO_BIN(?)', [ID]
      )

      if (info.length === 0) return false

      await connect.query(
        'DELETE FROM reviews WHERE ID = UUID_TO_BIN(?)', [ID]
      )
      return true
    } catch (error) {
      return { message: error.message }
    }
  }
}
