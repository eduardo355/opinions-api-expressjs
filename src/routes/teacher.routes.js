import express from 'express'
import {
  create,
  index,
  indexByUniversity,
  show,
} from '../controllers/teacher.controller.js'

const router = express.Router()

router.get('/teachers', index)
router.post('/teachers', create)
router.get('/teachers/:id', show)
router.get('/teachers/university/:id', indexByUniversity)

export default router
