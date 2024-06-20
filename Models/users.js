import mysql from 'mysql2/promise'
import config from '../config.js'

const connect = await mysql.createConnection(config)

export class usersModel {
  static async getAll (keys, values) {
    try {
      if (values.length > 0) {
        const placeholders = keys[0] === 'ID'
          ? `${keys} = UUID_TO_BIN(?)`
          : `${keys} = ?`
        const sqlQuery = `SELECT BIN_TO_UUID(ID) ID, Name, Email, isAdmin, password 
                            FROM users WHERE ${placeholders}`

        const [rows] = await connect.query(sqlQuery, values)
        return rows.length > 0 ? rows : false
      }
      const [rows] = await connect.query('SELECT BIN_TO_UUID(ID) ID, Name, Email, isAdmin, password FROM users')
      return rows
    } catch (error) {
      return { message: error.message }
    }
  }

  static async create (user) {
    const [row] = await connect.query(
      'SELECT * FROM users WHERE Email = ?', [user.Email]
    )
    if (row.length > 0) return false

    const {
      Name,
      Email,
      password,
      isAdmin
    } = user

    const [uuidResult] = await connect.query('SELECT UUID() uuid;')
    const [{ uuid }] = uuidResult
    try {
      await connect.query(
        `INSERT INTO users (Name, Email, Password, isAdmin, ID) 
        VALUES (?,?,?,?,UUID_TO_BIN(?))`, [Name, Email, password, isAdmin, uuid]
      )

      const [rows] = await connect.query(
        `SELECT BIN_TO_UUID(ID) ID, Name, Email, isAdmin, password 
        FROM users WHERE ID = UUID_TO_BIN(?)`, [uuid]
      )
      return rows
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async update (user, ID) {
    try {
      const [info] = await connect.query(
          `SELECT BIN_TO_UUID(ID) ID, Name, Email, isAdmin, password 
          FROM users WHERE ID = UUID_TO_BIN(?)`, [ID]
      )
      if (info.length === 0) return false

      const modify = { ...info[0], ...user }
      const {
        Name,
        Email,
        password,
        isAdmin
      } = modify

      await connect.query(
        `UPDATE users SET Name = ?, Email = ?, Password = ?, isAdmin = ? 
        WHERE ID = UUID_TO_BIN(?)`, [Name, Email, password, isAdmin, ID]
      )

      const [rows] = await connect.query(
        `SELECT BIN_TO_UUID(ID) ID, Name, Email, isAdmin, password 
        FROM users WHERE ID = UUID_TO_BIN(?)`, [ID]
      )
      return rows
    } catch (error) {
      return { message: error.message }
    }
  }

  static async delete (ID) {
    try {
      const [info] = await connect.query(
        `SELECT BIN_TO_UUID(ID) ID, Name, Email, isAdmin, password 
        FROM users WHERE ID = UUID_TO_BIN(?)`, [ID]
      )

      if (info.length === 0) return false

      await connect.query(
        'DELETE FROM users WHERE ID = UUID_TO_BIN(?)', [ID]
      )

      return true
    } catch (error) {
      throw new Error(error)
    }
  }
}
