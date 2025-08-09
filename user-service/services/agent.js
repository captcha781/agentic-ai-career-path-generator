import config from '@/config'
import { createSignature } from '@/utils/createSignature'
import axios from 'axios'

export const createCareerPath = async (data) => {
    try {
        const { signature, timestamp } = createSignature(data, {}, 'body')

        const response = await axios({
            method: 'POST',
            url: `${config.AGENT_HOST}/api/internal/create-career-path`,
            data,
            headers: {
                'PENTE-SIGNATURE': signature,
                'PENTE-TIMESTAMP': timestamp,
                'PENTE-VALIDATE': 'body',
                'PENTE-ORIGIN': 'user',
            },
        })

        if (response.status !== 200) {
            return { success: false }
        }

        return response.data
    } catch (error) {
        console.log('createCareerPath: service:', error)
        return { success: false }
    }
}
