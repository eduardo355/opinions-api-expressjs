import Joi from 'joi'
import { createTeacherSubject } from '../models/teacher.subject.model.js'

const teacherSubjectSchema = Joi.object({
  subject_ids: Joi.array().items(
    Joi.number().integer().positive().min(1).required()
  ),
})

export const create = async (req, res) => {
  const { teacher_id } = req.params
  const { error, value } = teacherSubjectSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: 'Error de validacion',
      details: error.details,
    })
  }

  const { subject_ids } = value

  try {
    const response = await Promise.all(
      subject_ids.map((subject_id) =>
        createTeacherSubject(teacher_id, subject_id)
      )
    )
    res.status(201).json({ response: response })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
