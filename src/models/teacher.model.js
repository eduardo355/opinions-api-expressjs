import { turso } from '../../db/db.js'

export const indexTeacherByName = async (q) => {
  const result = await turso.execute({
    sql: `
      SELECT 
        t.id, 
        t.rating,
        t.name AS teacher_name, 
        u.name AS university_name,
        COUNT(f.feedback) AS feedback_count
      FROM teachers t
      LEFT JOIN teacherUniversities tu ON t.id = tu.teacher_id
      LEFT JOIN universities u ON tu.university_id = u.id
      LEFT JOIN feedbacks f ON t.id = f.teacher_id
      WHERE t.name LIKE ?
      GROUP BY t.id, t.rating, t.name
    `,
    args: [`%${q}%`],
  })

  const teachersMap = new Map()

  result.rows.forEach((row) => {
    if (!teachersMap.has(row.id)) {
      teachersMap.set(row.id, {
        id: row.id,
        rating: row.rating,
        teacher_name: row.teacher_name,
        universities: new Set(),
        feedback_count: 0,
      })
    }

    const teacher = teachersMap.get(row.id)
    teacher.feedback_count = row.feedback_count
    if (row.university_name) teacher.universities.add(row.university_name)
  })

  return Array.from(teachersMap.values()).map((teacher) => ({
    ...teacher,
    universities: Array.from(teacher.universities),
  }))
}

export const indexTeacherByUniversity = async (id) => {
  const result = await turso.execute({
    sql: `
      SELECT 
        t.id, 
        t.rating,
        t.name AS teacher_name, 
        u.name AS university_name,
        COUNT(f.feedback) AS feedback_count
      FROM teachers t
      LEFT JOIN teacherUniversities tu ON t.id = tu.teacher_id
      LEFT JOIN universities u ON tu.university_id = u.id
      LEFT JOIN feedbacks f ON t.id = f.teacher_id
      WHERE tu.university_id = ?
      GROUP BY t.id, t.rating, t.name
    `,
    args: [id],
  })
  console.log('Result from database:', result)

  const teachersMap = new Map()

  result.rows.forEach((row) => {
    if (!teachersMap.has(row.id)) {
      teachersMap.set(row.id, {
        id: row.id,
        rating: row.rating,
        teacher_name: row.teacher_name,
        universities: new Set(),
        feedback_count: 0,
      })
    }

    const teacher = teachersMap.get(row.id)
    teacher.feedback_count = row.feedback_count
    if (row.university_name) teacher.universities.add(row.university_name)
  })

  return Array.from(teachersMap.values()).map((teacher) => ({
    ...teacher,
    universities: Array.from(teacher.universities),
  }))
}

export const showTeacherById = async (id) => {
  const result = await turso.execute({
    sql: `
      SELECT
        t.id,
        t.name AS teacher_name,
        GROUP_CONCAT(DISTINCT u.name) AS universities,
        GROUP_CONCAT(DISTINCT s.name) AS subjects,
        GROUP_CONCAT(DISTINCT f.feedback) AS feedbacks,
        GROUP_CONCAT(DISTINCT r.score) AS ratings -- Concatenar puntuaciones individuales
      FROM
        teachers t
      LEFT JOIN teacherUniversities tu ON t.id = tu.teacher_id
      LEFT JOIN universities u ON tu.university_id = u.id
      LEFT JOIN teacherSubjects ts ON t.id = ts.teacher_id
      LEFT JOIN subjects s ON ts.subject_id = s.id
      LEFT JOIN feedbacks f ON t.id = f.teacher_id
      LEFT JOIN ratings r ON t.id = r.teacher_id
      WHERE
        t.id = ?
      GROUP BY t.id
      `,
    args: [id],
  })

  if (result.rows.length === 0) return null // Manejo si no se encuentra el profesor

  const row = result.rows[0]

  return {
    id: row.id,
    teacher_name: row.teacher_name,
    universities: row.universities ? row.universities.split(',') : [],
    subjects: row.subjects ? row.subjects.split(',') : [],
    feedbacks: row.feedbacks ? row.feedbacks.split(',') : [],
    ratings: row.ratings ? row.ratings.split(',').map(Number) : [], // Convertir a array de números
  }
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
