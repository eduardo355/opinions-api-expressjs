import { createUser } from '../models/user.model.js'

export const create = async (req, res) => {
  const { google_id, name, email } = req.body

  try {
    const response = await createUser(google_id, name, email)

    res.status(201).json({ response: response })
  } catch (error) {
    res.status(500).json({ error: error })
  }
}
