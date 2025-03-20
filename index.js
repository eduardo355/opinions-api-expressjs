import cors from 'cors'
import dotenv from 'dotenv'
import morgan from 'morgan'
import helmet from 'helmet'
import express from 'express'
import rateLimit from 'express-rate-limit'
import { initialize_database } from './db/db.js'
import subjectRoutes from './src/routes/subject.routes.js'
import teacherRoutes from './src/routes/teacher.routes.js'
import feedbackRoutes from './src/routes/feedback.routes.js'
import universityRoutes from './src/routes/university.routes.js'
import teacherSubjectRoutes from './src/routes/teacher.subject.routes.js'
import teacherUnivesityRoutes from './src/routes/teacher.university.routes.js'

dotenv.config()
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 30,
  message: { error: 'Demasiadas solicitudes, intenta mas tarde.' },
})
const app = express()

app.use(cors())
app.use(limiter)
app.use(helmet())
app.use(express.json())
app.use(morgan('combined'))
const port = process.env.PORT || 3000

app.use('/api', teacherRoutes)
app.use('/api', subjectRoutes)
app.use('/api', feedbackRoutes)
app.use('/api', universityRoutes)
app.use('/api', teacherSubjectRoutes)
app.use('/api', teacherUnivesityRoutes)

initialize_database()
  .then(() => {
    app.listen(port, () => {
      console.log(`Servidor corriendo en el puerto ${port}`)
    })
  })
  .catch((error) => {
    console.error(error)
  })
