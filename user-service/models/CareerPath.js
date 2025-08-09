import mongoose from 'mongoose'
import * as enums from '@/constants/enums'

const TopicSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            default: '',
        },
        isCompleted: {
            type: Boolean,
            default: false,
        },
    },
    { _id: false },
)

const PathSchema = new mongoose.Schema(
    {
        week: {
            type: Number,
            default: 1,
        },
        progress: {
            type: Number,
            default: 0,
        },
        topics: [TopicSchema],
    },
    { timestamps: true },
)

const CareerPathSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Types.ObjectId,
            required: true,
        },
        status: {
            type: String,
            default: enums.CAREERPATH_STATES.START,
            enum: Object.values(enums.CAREERPATH_STATES),
        },
        name: {
            type: String,
            default: '',
        },
        skills: {
            type: [String],
            default: [],
        },
        timeline: {
            type: Number,
            default: 4,
        },
        period: {
            type: String,
            default: enums.CAREER_PERIOD.WEEKLY,
            enum: Object.values(enums.CAREER_PERIOD)
        },
        resume: {
            type: String,
            default: '',
        },
        path: [PathSchema],
    },
    { timestamps: true },
)

const CareerPath = mongoose.model('careerpath', CareerPathSchema, 'careerpath')
export default CareerPath
