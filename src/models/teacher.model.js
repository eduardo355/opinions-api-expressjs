import { turso } from '../../db/db.js'

export const indexTeacherByName = async (q) => {
  const result = await turso.execute({
    sql: `
      SELECT 
        teachers.id, 
        teachers.name AS teacher_name, 
        universities.name AS university_name 
      FROM teachers
      LEFT JOIN teacherUniversities ON teachers.id = teacherUniversities.teacher_id
      LEFT JOIN universities ON teacherUniversities.university_id = universities.id
      WHERE teachers.name LIKE ?`,
    args: [`%${q}%`],
  })

  const teachers = {}

  result.rows.forEach((row) => {
    if (!teachers[row.teacher_id]) {
      teachers[row.teacher_id] = {
        teacher_id: row.teacher_id,
        teacher_name: row.teacher_name,
        universities: [],
      }
    }
    teachers[row.teacher_id].universities.push(row.university_name)
  })

  return Object.values(teachers)
}

export const createTeacher = async (name) => {
  try {
    const result = await turso.execute({
      sql: 'INSERT INTO teachers (name) VALUES (?)',
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
      dbError.message = 'El maestro ya existe'
      dbError.type = 'DUPLICATE_ENTRY'
    }

    throw dbError
  }
}
