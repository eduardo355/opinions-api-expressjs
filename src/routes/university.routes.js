import express from 'express'
import { create, index } from '../controllers/university.controller.js'

const router = express.Router()

router.get('/universities', index)
router.post('/universities', create)

export default router
