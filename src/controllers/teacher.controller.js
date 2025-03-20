import Joi from 'joi'
import { createTeacher, indexTeacherByName } from '../models/teacher.model.js'

const teacherSchema = Joi.object({
  name: Joi.string().min(3).required(),
  rating: Joi.number().optional(),
})

export const index = async (req, res) => {
  const { q } = req.query

  if (!q) {
    return res.status(400).json({ error: 'Falta el parámetro de búsqueda "q"' })
  }

  try {
    const response = await indexTeacherByName(q)
    res.status(200).json({ response: response })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}

export const create = async (req, res) => {
  const { error, value } = teacherSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: 'Error al ingresar los datos',
      details: error.details,
    })
  }

  try {
    const response = await createTeacher(value.name)
    res.status(201).json({ response: response })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: {
        type: error.type,
        message: error.message,
        code: error.code || 'UNKNOWN_ERROR',
      },
    })
  }
}
