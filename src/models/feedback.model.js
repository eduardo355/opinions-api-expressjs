import { turso } from '../../db/db.js'

export const createFeedback = async (feedback, teacher_id) => {
  try {
    const result = await turso.execute({
      sql: 'INSERT INTO feedbacks (feedback, teacher_id) VALUES (?, ?)',
      args: [feedback, teacher_id],
    })

    return {
      success: true,
      result: result,
    }
  } catch (error) {
    const dbError = new Error(error.message)
    dbError.code = error.code
    throw dbError
  }
}
