import express from 'express'
import { verifySignature } from '@/middlewares/verifySignature'
import * as ctrl from '@/controllers'
import * as valid from '@/validations'

const router = express.Router()

router.route('/update-career-path/:careerId').post(verifySignature, valid.intr.updateCareerPath, ctrl.intr.updateCareerPath)

export default router
