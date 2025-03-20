import express from 'express'
import { create } from '../controllers/subject.controller.js'

const router = express.Router()

router.post('/subjects', create)

export default router
