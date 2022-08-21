import axios from 'axios'
import config from 'config'

export const kfClient = axios.create({
    baseURL: config.get('API.URL'),
    headers: {
        'x-api-key': process.env.API_KEY ?? ''
    }
})
