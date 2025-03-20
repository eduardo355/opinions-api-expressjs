import Joi from 'joi'
import { createTeacherUniversity } from '../models/teacher.university.model.js'

const teacherUniversitySchema = Joi.object({
  university_ids: Joi.array().items(
    Joi.number().integer().positive().min(1).required()
  ),
})

export const create = async (req, res) => {
  const { teacher_id } = req.params
  const { error, value } = teacherUniversitySchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: 'Error de validacion',
      details: error.details,
    })
  }

  const { university_ids } = value

  try {
    const response = await Promise.all(
      university_ids.map((university_id) =>
        createTeacherUniversity(teacher_id, university_id)
      )
    )
    res.status(201).json({ response: response })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
