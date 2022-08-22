import axios from 'axios'
import config from 'config'
import * as dotenv from 'dotenv'

dotenv.config()

export const kfClient = axios.create({
    baseURL: config.get('API.URL'),
    headers: {
        'x-api-key': process.env.API_KEY ?? ''
    }
})
