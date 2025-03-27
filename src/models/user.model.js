import { turso } from '../../db/db.js'

export const createUser = async (google_id, name, email) => {
  try {
    const existingUser = await turso.execute({
      sql: 'SELECT * FROM users WHERE google_id = ?',
      args: [google_id],
    })

    if (existingUser.rows.length > 0) {
      return {
        success: true,
        message: 'Usuario ya registrado',
        data: existingUser.rows[0],
      }
    }

    const result = await turso.execute({
      sql: 'INSERT INTO users (google_id, name, email) VALUES (?, ?, ?)',
      args: [google_id, name, email],
    })

    return {
      success: true,
      message: 'Usuario registrado correctamente',
      data: { id: result.lastInsertRowid, name, email },
    }
  } catch (error) {
    throw new Error('Error en la base de datos: ' + error.message)
  }
}
