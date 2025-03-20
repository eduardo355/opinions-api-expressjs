import express from 'express'
import { create } from '../controllers/teacher.subject.controller.js'

const router = express.Router()

router.post('/teachers/:teacher_id/subjects', create)

export default router
