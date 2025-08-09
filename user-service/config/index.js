import fs from 'fs'
import path from 'path'

const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,

    // API Hosts
    USER_HOST: process.env.USER_HOST,
    AGENT_HOST: process.env.AGENT_HOST,
    FRONTEND_HOST: process.env.FRONTEND_HOST,

    // MAIL INFO
    SMTP_MAIL: process.env.MAIL,
    SMTP_HOST: process.env.HOST,
    SMTP_PORT: process.env.MAILPORT,
    SMTP_SECURE: process.env.SECURE,
    SMTP_USER: process.env.USER_NAME,
    SMTP_PASS: process.env.PASSWORD,

    // OTHER UTILITIES
    REQUEST_TIMEOUT: 5000,

    // AUTH PEM KEY
    AUTH_PUBLIC_KEY: fs.readFileSync(path.resolve(path.join(__dirname, '../private/auth_public_key.pem')), 'utf8'),
    AUTH_SIGNER_KEY: Buffer.from(process.env.AUTH_PRIVATE_SIGNER, 'base64').toString('utf8'),

    // CRYPTO ENCRYPTION KEY
    CRYPTO_SECRET: process.env.CRYPTO_SECRET,

    // EXPIRATIONS
    ACCESS_TOKEN_EXPIRATION: '1d',
    REFRESH_TOKEN_EXPIRATION: '30d',
    OTP_EXPIRATION: '3m',
    DEFAULT_SALT_ROUNDS: 12,

    // ASSET URL
    ASSET_URL: process.env.ASSET_URL,

    // AWS S3 KEYS
    AWS_S3_REGION: process.env.AWS_S3_REGION,
    AWS_S3_PUBLIC: process.env.AWS_S3_PUBLIC,
    AWS_S3_ACCESS: process.env.AWS_S3_ACCESS,
    AWS_S3_SECRET: process.env.AWS_S3_SECRET,

    // S3 UPLINKS
    RESUME: 'resume',

    // S3 LIMITS
    MAX_RESUME_FILE_SIZE: 1.5 * 1024 * 1024,

    // HMAC KEYS
    HMAC_AGENT_KEY: process.env.HMAC_AGENT_KEY,
    HMAC_USER_KEY: process.env.HMAC_USER_KEY
}

export default config
