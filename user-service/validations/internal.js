import yupToFormError from '@/utils/yupToFormErrors'
import * as yup from 'yup'

export const updateCareerPath = async (req, res, next) => {
    try {
        const { body } = req

        const schema = yup.object({
            updatedPath: yup.array().required('Updated Path is required'),
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
