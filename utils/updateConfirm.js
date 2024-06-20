import myslq from 'mysql2/promise'
import config from '../config.js'

const connect = await myslq.createConnection(config)

export async function checkUserAndDishExistence (UserID, DishID) {
  try {
    let userExists = true
    let dishExists = true

    if (UserID) {
      const [userResult] = await connect.query(
        'SELECT ID FROM users WHERE ID = UUID_TO_BIN(?)', [UserID]
      )
      userExists = userResult.length > 0
    }

    if (DishID) {
      const [dishResult] = await connect.query(
        'SELECT ID FROM dishes WHERE ID = ?', [DishID]
      )
      dishExists = dishResult.length > 0
    }

    // Verifica si al menos uno de los IDs existe
    if (userExists && dishExists) {
      return true
    } else {
      return false // Ningún ID encontrado
    }
  } catch (error) {
    console.error(error)
    return false // Error en la consulta
  }
}
