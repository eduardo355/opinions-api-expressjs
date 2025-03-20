import express from 'express'
import { create } from '../controllers/university.controller.js'

const router = express.Router()

router.post('/universities', create)

export default router
