import Joi from 'joi'
import {
  createUniversity,
  indexUnversities,
} from '../models/university.model.js'

const univesitySchema = Joi.object({
  name: Joi.string().min(3).required(),
})

export const index = async (req, res) => {
  try {
    const response = await indexUnversities()
    res.status(200).json({ response: response })
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

export const create = async (req, res) => {
  const { error, value } = univesitySchema.validate(req.body)

  if (error) {
    return res.status(400).json({
      message: 'Error al ingresar los datos',
      details: error.details,
    })
  }

  try {
    const response = await createUniversity(value.name)
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
