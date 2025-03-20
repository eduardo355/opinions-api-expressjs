import { turso } from '../../db/db.js'

export const createUniversity = async (name) => {
  try {
    const result = await turso.execute({
      sql: 'INSERT INTO universities (name) VALUES (?)',
      args: [name],
    })

    return {
      success: true,
      data: result.rows,
    }
  } catch (error) {
    const dbError = new Error(error.message)
    dbError.code = error.code
    if (error.code === 'SQLITE_CONSTRAINT') {
      dbError.message = 'La universidad ya existe'
      dbError.type = 'DUPLICATE_ENTRY'
    }

    throw dbError
  }
}
