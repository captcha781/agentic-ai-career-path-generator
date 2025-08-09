import config from '@/config'
import { CareerPath } from '@/models'
import isEmpty from 'is-empty'
import * as services from '@/services'

export const userInfo = async (req, res) => {
    try {
        const { user } = req

        const data = {
            firstName: user.firstName,
            middleName: user.middleName,
            lastName: user.lastName,
            isPasswordUpdated: user.isPasswordUpdated,
            email: user.email,
        }

        return res.status(200).json({ success: true, data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const createCareerPath = async (req, res) => {
    try {
        const { file, body, user } = req

        const formattedUrlForResume = !isEmpty(file) ? `${config.ASSET_URL}/${file.key}` : ''

        const careerPath = new CareerPath({
            userId: user._id,
            name: body.name,
            resume: !isEmpty(file) ? file.key : '',
            skills: body.skills,
            timeline: body.timeline,
        })

        const requestData = {
            career_id: careerPath._id,
            skills: body.skills,
            timeline: body.timeline,
            period: careerPath.period,
            resume: formattedUrlForResume,
            user_input: body.userInput,
        }

        const { success, result } = await services.agent.createCareerPath(requestData)
        if (!success) {
            return res.status(400).json({ success: false, message: 'Could not create your career path currently please try after sometime' })
        }

        careerPath.path = result

        await careerPath.save()

        const data = { career_id: careerPath._id, name: body.name }

        return res.status(201).json({ success: true, message: 'Career path creaeted successfully', data })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const getCareerPaths = async (req, res) => {
    try {
        const { user } = req

        const careerPaths = await CareerPath.find({ userId: user._id }, { name: 1, skills: 1, timeline: 1, period: 1, createdAt: 1 })
            .sort({ _id: -1 })
            .lean()

        return res.status(200).json({ success: true, data: careerPaths })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const getCareerPathById = async (req, res) => {
    try {
        const { user, params } = req

        const careerPath = await CareerPath.findOne({ userId: user._id, _id: params.careerId }).lean()

        if (isEmpty(careerPath)) {
            return res.status(400).json({ success: false, message: 'Career path not found' })
        }

        return res.status(200).json({ success: true, data: careerPath })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}

export const updateCareerTasks = async (req, res) => {
    try {
        const { params, user, body } = req

        const updation = await CareerPath.updateOne(
            { '_id': params.careerId, 'path._id': body.weekId, 'userId': user._id },
            {
                $set: {
                    [`path.$.topics.${body.topic}.isCompleted`]: body.isChecked,
                },
            },
        ).lean()

        if (updation.modifiedCount == 0) {
            return res.status(400).json({ success: false, message: 'Could update the topic' })
        }

        return res.status(201).json({ success: true, message: 'Topic updated successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}
