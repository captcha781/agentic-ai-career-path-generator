import * as yup from 'yup'
import * as enums from '@/constants/enums'
import * as regex from '@/constants/regex'
import yupToFormError from '@/utils/yupToFormErrors'

export const createCareerPath = async (req, res, next) => {
    try {
        const { body } = req
        body.skills = JSON.parse(body.skills)

        const schema = yup.object({
            name: yup.string().trim().min(3).max(50).optional(),
            timeline: yup.number().min(2).max(24).required(),
            skills: yup
                .array()
                .of(yup.string().trim().min(1)) // array of non-empty strings
                .max(5, 'You can select a maximum of 5 skills'),
            userInput: yup.string().max(500).optional(),
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

export const updateCareerTasks = async (req, res, next) => {
    try {
        const { body } = req

        const schema = yup.object({
            isChecked: yup.boolean().required('Required'),
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
