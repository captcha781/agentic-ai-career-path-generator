import * as yup from 'yup'
import * as enums from '@/constants/enums'
import * as regex from '@/constants/regex'
import yupToFormError from '@/utils/yupToFormErrors'

export const signup = async (req, res, next) => {
    try {
        const { body } = req

        const schema = yup.object({
            firstName: yup.string().trim().min(3).max(64).required(),
            lastName: yup.string().trim().min(1).max(64).required(),
            middleName: yup.string().trim().max(64).optional(),
            email: yup
                .string()
                .email()
                .matches(regex.EMAIL, 'Email has invalid characters')
                .matches(regex.EMAIL_CHARS, 'Email has invalid characters')
                .required(),
        })

        try {
            await schema.validate(body, { abortEarly: false })
            return next()
        } catch (error) {
            return res.status(400).json({ success: false, errors: yupToFormError(error) })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const createPassword = async (req, res, next) => {
    try {
        const { body } = req

        const schema = yup.object({
            password: yup
                .string()
                .required('Password is required')
                .min(8, 'Password must be minimum of 8 characters')
                .max(32, 'Password must be maximum of 32 characters')
                .matches(regex.PASSWORD, 'Password does not meet criteria'),

            confirmPassword: yup
                .string()
                .oneOf([yup.ref('password')], 'Passwords must match')
                .required('Please confirm your password'),
        })

        try {
            await schema.validate(body, { abortEarly: false })
            return next()
        } catch (error) {
            return res.status(400).json({ success: false, errors: yupToFormError(error) })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const signin = async (req, res, next) => {
    try {
        const { body } = req

        const schema = yup.object({
            email: yup
                .string()
                .email()
                .matches(regex.EMAIL, 'Email has invalid characters')
                .matches(regex.EMAIL_CHARS, 'Email has invalid characters')
                .required(),
            password: yup
                .string()
                .required('Password is required')
                .min(8, 'Invalid Password')
                .max(32, 'Invalid Password')
                .matches(regex.PASSWORD, 'Invalid Password'),
        })

        try {
            await schema.validate(body, { abortEarly: false })
            return next()
        } catch (error) {
            return res.status(400).json({ success: false, errors: yupToFormError(error) })
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}
