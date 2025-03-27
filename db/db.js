import { createClient } from '@libsql/client'
import dotenv from 'dotenv'

dotenv.config()

export const turso = createClient({
  url: process.env.TURSO_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
})

const create_users = `
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    google_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`

const create_ratings = `
  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    score INTEGER CHECK(score BETWEEN 1 AND 5),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE (teacher_id, user_id)
  )
`

const create_universities = `
  CREATE TABLE IF NOT EXISTS universities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE
  )
`

const create_teachers = `
  CREATE TABLE IF NOT EXISTS teachers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    rating FLOAT DEFAULT 0.0
  )
`

const create_subject = `
  CREATE TABLE IF NOT EXISTS subjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE 
  )
`

const create_feedbacks = `
  CREATE TABLE IF NOT EXISTS feedbacks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    feedback TEXT NOT NULL,
    teacher_id NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE
  )
`

const create_teacher_subjects = `
  CREATE TABLE IF NOT EXISTS teacherSubjects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id NOT NULL,
    subject_id NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (subject_id) REFERENCES subjects(id) ON DELETE CASCADE,
    UNIQUE(teacher_id, subject_id)
  )
`

const create_teacher_universities = `
  CREATE TABLE IF NOT EXISTS teacherUniversities (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    teacher_id NOT NULL,
    university_id NOT NULL,
    FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    FOREIGN KEY (university_id) REFERENCES universities(id) ON DELETE CASCADE,
    UNIQUE(teacher_id, university_id)
  )
`

export async function initialize_database() {
  try {
    await turso.execute(create_users)
    await turso.execute(create_ratings)
    await turso.execute(create_subject)
    await turso.execute(create_teachers)
    await turso.execute(create_feedbacks)
    await turso.execute(create_universities)
    await turso.execute(create_teacher_subjects)
    await turso.execute(create_teacher_universities)
    console.log('✅ Tabla "teachers" creada exitosamente.')
    console.log('✅ Tabla "subjects" creada exitosamente.')
    console.log('✅ Tabla "feedbacks" creada exitosamente.')
    console.log('✅ Tabla "universities" creada exitosamente.')
  } catch (error) {
    console.error('❌ Error al crear la tabla:', error)
  }
}
