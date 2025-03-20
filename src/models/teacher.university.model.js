import { turso } from '../../db/db.js'

export const createTeacherUniversity = async (teacher_id, university_id) => {
  return await turso.execute({
    sql: 'INSERT INTO teacherUniversities (teacher_id, university_id) VALUES (?, ?)',
    args: [teacher_id, university_id],
  })
}
