import { OutageItem } from '../types/outageTypes'
import { RequestResponse } from '../types/requestType'
import { handleRequest } from '../apiHandlers/apiHandler'

import axios, { AxiosResponse } from 'axios'
import config from 'config'

export const requestOutages = async (): Promise<AxiosResponse> => {
    const outagesURL = `${config.get('API.URL')}${config.get(
        'API.OUTAGES_ENDPOINT'
    )}`
    const outagesRequest = `${outagesURL}?api_key=${process.env.API_KEY}`
    return await axios.get<OutageItem[]>(outagesRequest)
}

export const getAllOutages = async (): Promise<RequestResponse> => {
    return handleRequest(requestOutages())
}
