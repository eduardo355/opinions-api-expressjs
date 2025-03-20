import express from 'express'
import { create, index } from '../controllers/teacher.controller.js'

const router = express.Router()

router.get('/teachers', index)
router.post('/teachers', create)

export default router
