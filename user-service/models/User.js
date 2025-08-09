import mongoose from 'mongoose'
import * as enums from '@/constants/enums'

const UserSchema = new mongoose.Schema(
    {
        firstName: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        middleName: {
            type: String,
            default: '',
        },
        email: {
            type: String,
            required: true,
        },
        isEmailVerified: {
            type: Boolean,
            default: false,
        },
        password: {
            type: String,
            default: '',
        },
        isPasswordUpdated: {
            type: Boolean,
            default: false,
        },
        passwordUpatedOn: {
            type: Date,
            default: null,
        },
        lastLoginOn: {
            type: Date,
            default: null,
        },
        status: {
            type: String,
            default: enums.USER_STATES.NEW,
            enum: Object.values(enums.USER_STATES),
        },
    },
    { timestamps: true },
)

const User = mongoose.model('users', UserSchema, 'user')
export default User
