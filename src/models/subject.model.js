import { turso } from '../../db/db.js'

export const createSubject = async (name) => {
  try {
    const result = await turso.execute({
      sql: 'INSERT INTO subjects (name) VALUES (?)',
      args: [name],
    })

    return {
      success: true,
      data: result,
    }
  } catch (error) {
    const dbError = new Error(error.message)
    dbError.code = error.code

    if (error.code === 'SQLITE_CONSTRAINT') {
      dbError.message = 'La materia ya existe'
      dbError.type = 'DUPLICATE_ENTRY'
    }

    throw dbError
  }
}
