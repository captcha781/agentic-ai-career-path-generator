import express from 'express'
import * as valid from '@/validations'
import * as ctrl from '@/controllers'
import { userAuthenticate } from '@/security/passport'

const router = express.Router()

router.route('/signup').post(valid.auth.signup, ctrl.auth.signup)
router.route('/email-verify/:verificationToken').get(ctrl.auth.verifySignup)
router.route('/create-password').post(userAuthenticate, valid.auth.createPassword, ctrl.auth.createPassword)

router.route('/signin').post(valid.auth.signin, ctrl.auth.signin)
router.route('/refresh-token').get(userAuthenticate, ctrl.auth.refreshToken)
router.route('/signout').get(ctrl.auth.signout)


export default router
