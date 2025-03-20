import express from 'express'
import { create } from '../controllers/teacher.university.controller.js'

const router = express.Router()

router.post('/teachers/:teacher_id/universities', create)

export default router
