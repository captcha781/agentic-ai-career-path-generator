import isEmpty from 'is-empty'
import { v4 as uuid } from 'uuid'
import bcryptjs from 'bcryptjs'
import { Security, Token, User } from '@/models'
import * as enums from '@/constants/enums'
import * as constants from '@/constants/values'
import generateSecurityToken from '@/utils/generateSecurityToken'
import { encryptString } from '@/security/crypto'
import config from '@/config'
import { sendEmailViaTemplate } from './mail'
import { comparePassword, generateJWTToken } from '@/security/security'
import { decodeJWT } from '@/security/passport'

export const signup = async (req, res) => {
    try {
        const { body } = req
        body.email = body.email.toLowerCase()

        const isEmailExists = await User.findOne({ email: body.email, status: { $in: [enums.USER_STATES.ACTIVE, enums.USER_STATES.BLOCKED] } })
        if (!isEmpty(isEmailExists)) {
            return res.status(400).json({ success: false, message: 'Email already exists', errors: { email: 'Email already exists' } })
        }

        const user = new User({
            firstName: body.firstName,
            middleName: body.middleName,
            lastName: body.lastName,
            email: body.email,
        })

        const token = generateSecurityToken()
        const encryptedToken = encryptString(token)
        const formattedVerificationLink = `${config.FRONTEND_HOST}/email-verify/${encryptedToken}`

        const security = new Security({
            userId: user._id,
            type: enums.SECURITY_TYPES.ACTIVATION_MAIL,
            mode: enums.SECURITY_MODES.EMAIL,
            value: encryptedToken,
            secret: token,
            expiresAt: new Date(Date.now() + constants.ACTIVATION_DURATION),
        })

        const mailContext = {
            identifier: enums.EMAIL_CATEGORIES.VERIFICATION_MAIL,
            to: user.email,
            content: {
                activationLink: formattedVerificationLink,
                name: user.firstName,
            },
        }
        const emailSentStatus = await sendEmailViaTemplate(mailContext)

        if (!emailSentStatus) {
            return res.status(500).json({ success: false, message: 'Something went wrong' })
        }

        await user.save()
        await security.save()

        return res.status(201).json({ success: true, message: 'Kindly check your email to activate your account' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const verifySignup = async (req, res) => {
    try {
        const { params } = req

        const security = await Security.findOne({
            value: params.verificationToken,
            type: enums.SECURITY_TYPES.ACTIVATION_MAIL,
        })

        if (isEmpty(security)) {
            return res.status(400).json({ success: false, message: 'Invalid verification token' })
        }

        if (security.isCompleted) {
            return res.status(400).json({ success: false, message: 'Verification token already used' })
        }

        if (security.expiresAt < new Date()) {
            return res.status(400).json({ success: false, message: 'Verification token expired' })
        }

        security.isCompleted = true

        const userUpdation = await User.updateOne(
            { _id: security.userId, status: enums.USER_STATES.NEW },
            { $set: { status: enums.USER_STATES.PENDING } },
        )

        await security.save()
        if (userUpdation.modifiedCount == 0) {
            return res.status(400).json({ success: false, message: 'Your account has been already verified' })
        }

        const payload = {
            sessionId: uuid(),
            userId: security.userId,
            mode: enums.USER_STATES.PENDING,
        }

        const accessToken = generateJWTToken(payload, false)
        const refreshToken = generateJWTToken(payload, true)

        const session = new Token({
            userId: security.userId,
            expiresAt: new Date(Date.now() + constants.REFRESH_EXPIRY_DURATION),
            sessionId: payload.sessionId,
        })

        await session.save()

        const cookieConfig = {
            maxAge: constants.REFRESH_EXPIRY_DURATION,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            expiresIn: constants.REFRESH_EXPIRY_DURATION,
            partitioned: true,
        }

        res.header('Access-Control-Allow-Origin', config.FRONTEND_HOST)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.cookie('refreshToken', refreshToken, cookieConfig)

        return res.status(200).json({ success: true, message: 'Email verified succesfully', tokens: { accessToken } })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const createPassword = async (req, res) => {
    try {
        const { user, body } = req

        if (user.isPasswordUpdated) {
            return res.status(400).json({ success: false, message: 'Password already updated', action: 'LOGOUT' })
        }

        const hashedPassword = await bcryptjs.hash(body.password, bcryptjs.genSaltSync())

        const userUpdation = await User.updateOne(
            { _id: user._id },
            { $set: { password: hashedPassword, isPasswordUpdated: true, passwordUpatedOn: new Date(), status: enums.USER_STATES.ACTIVE } },
        ).lean()

        if (userUpdation.modifiedCount == 0) {
            console.log('Create Password: Password updation failed')
            return res.status(500).json({ success: false, message: 'Something went wrong' })
        }

        const payload = {
            sessionId: user.sessionId,
            userId: user._id,
            mode: enums.USER_STATES.ACTIVE,
        }

        const accessToken = generateJWTToken(payload, false)
        const refreshToken = generateJWTToken(payload, true)

        await Token.updateOne(
            { sessionId: payload.sessionId },
            { $set: { expiresAt: new Date(Date.now() + constants.REFRESH_EXPIRY_DURATION) } },
        ).lean()

        const cookieConfig = {
            maxAge: constants.REFRESH_EXPIRY_DURATION,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            expiresIn: constants.REFRESH_EXPIRY_DURATION,
            partitioned: true,
        }

        const data = {
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            isPasswordUpdated: user.isPasswordUpdated,
            email: user.email,
        }

        res.header('Access-Control-Allow-Origin', config.FRONTEND_HOST)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.cookie('refreshToken', refreshToken, cookieConfig)

        return res.status(201).json({ success: true, message: 'Password created successfully', tokens: { accessToken }, data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const signin = async (req, res) => {
    try {
        const { body } = req
        body.email = body.email.toLowerCase()

        const user = await User.findOne({ email: body.email }).lean()

        if (isEmpty(user)) {
            return res.status(400).json({ success: false, message: 'Email not found', errors: { email: 'Email not found' } })
        }

        if (user.status !== enums.USER_STATES.ACTIVE) {
            return res.status(403).json({ success: false, message: `Your account has been currently ${user.status}` })
        }

        const isPasswordValid = await comparePassword(body.password, user.password)
        if (!isPasswordValid) {
            return res.status(403).json({ success: false, message: 'Invalid Password' })
        }

        await User.updateOne({ _id: user._id }, { $set: { lastLoginOn: new Date() } })

        const payload = {
            sessionId: uuid(),
            userId: user._id,
            mode: enums.USER_STATES.ACTIVE,
        }

        const accessToken = generateJWTToken(payload, false)
        const refreshToken = generateJWTToken(payload, true)

        const session = new Token({
            userId: user._id,
            expiresAt: new Date(Date.now() + constants.REFRESH_EXPIRY_DURATION),
            sessionId: payload.sessionId,
        })
        await session.save()

        const cookieConfig = {
            maxAge: constants.REFRESH_EXPIRY_DURATION,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            expiresIn: constants.REFRESH_EXPIRY_DURATION,
            partitioned: true,
        }

        const data = {
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            isPasswordUpdated: user.isPasswordUpdated,
            email: user.email,
        }

        res.header('Access-Control-Allow-Origin', config.FRONTEND_HOST)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.cookie('refreshToken', refreshToken, cookieConfig)

        return res.status(201).json({ success: true, message: 'Signed in successfully', tokens: { accessToken }, data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const refreshToken = async (req, res) => {
    try {
        const { user } = req

        const mode = user.isPasswordUpdated ? enums.USER_STATES.ACTIVE : enums.USER_STATES.PENDING

        const session = await Token.findOne({ userId: user._id, sessionId: user.sessionId })

        if (session.isSessionEnded) {
            return res.status(401).json({ success: false, message: 'Session already ended' })
        }

        const payload = {
            sessionId: user.sessionId,
            userId: user._id,
            mode,
        }

        const accessToken = generateJWTToken(payload, false)
        const refreshToken = generateJWTToken(payload, true)

        await Token.updateOne(
            { sessionId: payload.sessionId },
            { $set: { expiresAt: new Date(Date.now() + constants.REFRESH_EXPIRY_DURATION) } },
        ).lean()

        const cookieConfig = {
            maxAge: constants.REFRESH_EXPIRY_DURATION,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            expiresIn: constants.REFRESH_EXPIRY_DURATION,
            partitioned: true,
        }

        res.header('Access-Control-Allow-Origin', config.FRONTEND_HOST)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.cookie('refreshToken', refreshToken, cookieConfig)

        return res.status(201).json({ success: true, message: 'Token issued successfully', tokens: { accessToken } })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const signout = async (req, res) => {
    try {
        const { headers } = req

        if (headers['authorization']) {
            const token = headers['authorization'].replace('Bearer ', '')
            const decodedToken = decodeJWT(token)

            await Token.updateOne({ sessionId: decodedToken.sessionId })
        }

        const cookieConfig = {
            maxAge: 0,
            httpOnly: true,
            sameSite: 'none',
            secure: true,
            expiresIn: 0,
            partitioned: true,
        }

        res.header('Access-Control-Allow-Origin', config.FRONTEND_HOST)
        res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept')
        res.cookie('refreshToken', '', cookieConfig)

        return res.status(200).json({ success: true, message: 'Signout Successful' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}
