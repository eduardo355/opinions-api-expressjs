import { turso } from '../../db/db.js'

export const createTeacherSubject = async (teacher_id, subject_id) => {
  return await turso.execute({
    sql: 'INSERT INTO teacherSubjects (teacher_id, subject_id) VALUES (?, ?)',
    args: [teacher_id, subject_id],
  })
}
