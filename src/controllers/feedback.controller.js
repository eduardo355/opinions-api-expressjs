import Joi from 'joi'
import { createFeedback } from '../models/feedback.model.js'

const feedbackSchema = Joi.object({
  feedback: Joi.string().min(3).required(),
})

export const create = async (req, res) => {
  const { teacher_id } = req.params

  const { error, value } = feedbackSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: 'Error en la validacion',
      details: error.details,
    })
  }

  try {
    const response = await createFeedback(value.feedback, teacher_id)

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
