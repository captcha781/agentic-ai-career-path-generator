import { CareerPath } from '@/models'

export const updateCareerPath = async (req, res) => {
    try {
        const { params, body } = req

        const updation = await CareerPath.updateOne({ _id: params.careerId }, { $set: { path: body.updatedPath } })

        if (updation.modifiedCount == 0) {
            return res.stats(500).json({ success: false, message: 'Updation failed' })
        }

        return res.status(200).json({ success: true, message: 'Updated successfully' })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ success: false, message: 'Something went wrong' })
    }
}
