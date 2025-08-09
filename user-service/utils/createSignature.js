import crypto from 'crypto'
import config from '@/config'

export const createSignature = (body = {}, query = {}, mode = 'body') => {
    let message = ''
    const timestamp = String(Date.now())

    if (mode == 'body') {
        message = JSON.stringify(body) + timestamp
    } else if (mode == 'query') {
        message = JSON.stringify(query) + timestamp
    } else if (mode == 'both') {
        message = JSON.stringify(query) + JSON.stringify(body) + timestamp
    } else {
        throw TypeError('Invalid type mode')
    }

    const signature = crypto.createHmac('SHA256', Buffer.from(config.HMAC_USER_KEY, 'utf-8'))
    signature.update(message)

    return { signature: signature.digest('hex'), timestamp: timestamp }
}