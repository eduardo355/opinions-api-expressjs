import Joi from 'joi'
import { createRating } from '../models/rating.model.js'

const ratingSchema = Joi.object({
  teacher_id: Joi.number().required().positive(),
  user_id: Joi.number().required().positive(),
  score: Joi.number().required().min(1).max(5).integer(),
})

export const create = async (req, res) => {
  const { error, value } = ratingSchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: 'Error de validacion',
      details: error.details,
    })
  }

  try {
    const respose = await createRating(
      value.teacher_id,
      value.user_id,
      value.score
    )

    res.status(201).json({ respose: respose })
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
