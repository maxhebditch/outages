import axios from 'axios'
import config from 'config'
import * as dotenv from 'dotenv'

dotenv.config()

// Shared axios client that uses the configured base URl and API key from the env file
export const kfClient = axios.create({
    baseURL: config.get('API.URL'),
    headers: {
        'x-api-key': process.env.API_KEY ?? ''
    }
})
