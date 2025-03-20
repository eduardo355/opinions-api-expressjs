import Joi from 'joi'
import { createSubject } from '../models/subject.model.js'

const subjectSchema = Joi.object({
  name: Joi.string().min(3).required(),
})

export const create = async (req, res) => {
  const { error, value } = subjectSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: 'Error de validacion',
      details: error.details,
    })
  }

  try {
    const response = await createSubject(value.name)
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
