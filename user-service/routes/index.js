import express from 'express'
import authRoutes from './auth'
import userRoutes from './user'
import intrRoutes from './internal'

const router = express.Router()

router.use('/auth', authRoutes)
router.use('/user', userRoutes)
router.use('/internal', intrRoutes)

export default router
