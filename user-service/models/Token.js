import mongoose from 'mongoose'

const TokenSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'users',
        },
        sessionId: {
            type: String,
            required: true,
        },
        expiresAt: {
            type: Date,
            default: null,
        },
        isSessionEnded: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

const Token = mongoose.model('token', TokenSchema, 'token')
export default Token
