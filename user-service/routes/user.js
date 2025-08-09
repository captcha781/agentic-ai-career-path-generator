import express from 'express'
import * as valid from '@/validations'
import * as ctrl from '@/controllers'
import * as intr from '@/integrations'
import * as enums from '@/constants/enums'
import { userAuthenticate } from '@/security/passport'
import config from '@/config'

const router = express.Router()

router.route('/user-info').get(userAuthenticate, ctrl.user.userInfo)

router
    .route('/career-path')
    .post(userAuthenticate, intr.s3.awsUpload(config.RESUME, enums.AWS_FILE_TYPES.SINGLE), valid.user.createCareerPath, ctrl.user.createCareerPath)
    .get(userAuthenticate, ctrl.user.getCareerPaths)

router
    .route('/career-path/:careerId')
    .get(userAuthenticate, ctrl.user.getCareerPathById)
    .put(userAuthenticate, valid.user.updateCareerTasks, ctrl.user.updateCareerTasks)

export default router
