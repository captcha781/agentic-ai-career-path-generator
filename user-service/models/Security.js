import mongoose from 'mongoose'
import * as enums from '@/constants/enums'

const SecuritySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: 'users',
        },
        type: {
            type: String,
            required: true,
            enums: Object.values(enums.SECURITY_TYPES),
        },
        mode: {
            type: String,
            required: true,
            enum: Object.values(enums.SECURITY_MODES),
        },
        value: {
            type: String,
            default: '',
        },
        secret: {
            type: String,
            default: '',
        },
        expiresAt: {
            type: Date,
            default: null,
        },
        requestAt: {
            type: Date,
            default: null,
        },
        requestCount: {
            type: Number,
            default: 0,
        },
        tries: {
            type: Number,
            default: 0,
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true },
)

const Security = mongoose.model('security', SecuritySchema, 'security')
export default Security
