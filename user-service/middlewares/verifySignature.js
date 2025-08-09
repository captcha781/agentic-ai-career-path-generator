import crypto from 'crypto'
import config from '@/config'
import isEmpty from 'is-empty'

/**
 * Important Params,
 *
 * @field PENTE-SIGNATURE - header - signature
 * @field PENTE-ORIGIN - request origin - type of service [ agent | user ]
 * @field PENTE-VALIDATE - validator type - used for signature verification [ body | query | both <query + body> ]
 * @field PENTE-TIMESTAMP - timestamp of the placed request - Its required for signature authenticity
 *
 */
export const verifySignature = async (req, res, next) => {
    try {
        const { headers, body, query } = req
        
        const signature = headers['pente-signature']
        const origin = headers['pente-origin']
        const validate = headers['pente-validate']
        const timestamp = headers['pente-timestamp']

        if (isEmpty(signature) || isEmpty(origin) || isEmpty(validate) || isEmpty(timestamp)) {
            return res.status(403).json({ success: false, message: 'Signature Invalid' })
        }

        let validator = JSON.stringify(body) + timestamp

        if (validate === 'query') {
            validator = JSON.stringify(query) + timestamp
        } else if (validate === 'both') {
            validator = JSON.stringify(query) + JSON.stringify(body) + timestamp
        }

        let key = ''

        if (origin === 'agent') {
            key = config.HMAC_AGENT_KEY
        } else if (origin === 'user') {
            key = config.HMAC_USER_KEY
        } else {
            return res.status(403).json({ success: false, message: 'Invalid Origin' })
        }

        const generatedSignature = crypto.createHmac('SHA256', Buffer.from(key, 'utf-8'))
        generatedSignature.update(validator)

        const latestSignature = generatedSignature.digest('hex')
        const isValid = crypto.timingSafeEqual(Buffer.from(latestSignature, 'hex'), Buffer.from(signature, 'hex'))

        if (!isValid) {
            return res.status(403).json({ success: false, message: 'Signature Invalid' })
        } else {
            return next()
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}
