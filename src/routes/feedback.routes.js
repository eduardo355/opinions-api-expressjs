import express from 'express'
import { create } from '../controllers/feedback.controller.js'

const router = express.Router()

router.post('/teachers/:teacher_id/feedbacks', create)

export default router
