import mysql from 'mysql2/promise'
import config from '../config.js'

const connect = await mysql.createConnection(config)

export class dishesModel {
  static async getAll (keys, values) {
    try {
      if (keys.length > 0) {
        const placeholder = `${keys} = ?`
        const sqlQuery = `SELECT * FROM dishes WHERE ${placeholder}`
        const [rows] = await connect.query(sqlQuery, values)

        return rows
      }
      const [rows] = await connect.query('SELECT * FROM dishes')

      return rows
    } catch (error) {
      return { message: error.message }
    }
  }

  static async create (dish) {
    try {
      const {
        Name,
        Description,
        Price,
        Category,
        Photography
      } = dish

      const [exists] = await connect.query(
        'SELECT ID FROM dishes WHERE Name = ?', [Name]
      )
      if (exists.length > 0) return false

      await connect.query(
        `INSERT INTO dishes (Description, Price, Category, Photography, Name) 
        VALUES (?, ?, ?, ?, ?)`, [Description, Price, Category, Photography, Name]
      )

      const [newDish] = await connect.query(
        'SELECT * FROM dishes WHERE Name = ?', [Name]
      )

      return newDish
    } catch (error) {
      return { message: error.message }
    }
  }

  static async update (dish, ID) {
    try {
      const [exist] = await connect.query(
        'SELECT * FROM dishes WHERE ID = ?', [ID]
      )
      if (exist.length === 0) return false

      const newDish = { ...exist[0], ...dish }

      const {
        Name,
        Description,
        Price,
        Category,
        Photography
      } = newDish

      await connect.query(
        `UPDATE dishes 
         SET Name = ?, Description = ?, Price = ?, Category = ?, Photography = ?
         WHERE ID = ?`,
        [Name, Description, Price, Category, Photography, ID]
      )

      const [updateDish] = await connect.query(
        'SELECT * FROM dishes WHERE ID = ?', [ID]
      )

      return updateDish
    } catch (error) {
      return { message: error.message }
    }
  }

  static async delete (ID) {
    try {
      const [exist] = await connect.query(
        'SELECT * FROM dishes WHERE ID = ?', [ID]
      )

      if (exist.length === 0) return false

      await connect.query(
        'DELETE FROM dishes WHERE ID = ?', [ID]
      )
      return true
    } catch (error) {
      return { message: error.message }
    }
  }
}
