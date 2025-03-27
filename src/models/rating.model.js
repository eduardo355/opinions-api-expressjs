import { turso } from '../../db/db.js'

export const createRating = async (teacher_id, user_id, score) => {
  try {
    const result = await turso.execute({
      sql: 'INSERT INTO ratings (teacher_id, user_id, score) VALUES (?, ?, ?)',
      args: [teacher_id, user_id, score],
    })

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    const dbError = new Error(error.message)
    dbError.code = error.code

    if (error.code === 'SQLITE_CONSTRAINT') {
      dbError.message = 'Error, ya existe una calificacion con ese usuario.'
      dbError.type = 'DUPLICATE_ENTRY'
    }

    throw dbError
  }
}
