import express from 'express'
import { create } from '../controllers/rating.controller.js'

const router = express.Router()

router.post('/ratings', create)

export default router
