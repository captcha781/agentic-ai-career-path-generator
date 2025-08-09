import jsonwebtoken from 'jsonwebtoken'
import config from '@/config'
import * as enums from '@/constants/enums'
import { Token, User } from '@/models'

export const userAuthenticate = async (req, res, next) => {
    try {
        const isRefreshing = req.path.endsWith('/refresh-token')

        const token = isRefreshing ? req.cookies.refreshToken : req.headers.authorization.split(' ')[1]
        const decoded = jsonwebtoken.verify(token, config.AUTH_PUBLIC_KEY, { algorithms: ['RS256'] })

        const user = await User.findById(decoded.userId).lean()

        const tokenRecord = await Token.findOne({ sessionId: decoded.sessionId }).lean()

        if (!tokenRecord) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        if (!user) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        if (tokenRecord.isSessionEnded) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        if (user.status !== enums.USER_STATES.ACTIVE && user.status !== enums.USER_STATES.PENDING) {
            return res.status(401).json({ success: false, message: 'Unauthorized' })
        }

        req.user = user
        req.user.sessionId = tokenRecord.sessionId

        return next()
    } catch (error) {
        console.log(error.message)
        return res.status(401).json({ success: false, message: 'Unauthorized' })
    }
}

export const decodeJWT = (token) => {
    return jsonwebtoken.decode(token)
}
