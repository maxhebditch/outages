import { OutageItem } from '../types/outageTypes'
import { RequestResponse } from '../types/requestType'

import axios, { AxiosResponse, AxiosError } from 'axios'
import config from 'config'

export const requestOutages = async (): Promise<AxiosResponse> => {
    const outagesURL = `${config.get('API.URL')}${config.get(
        'API.OUTAGES_ENDPOINT'
    )}`
    const outagesRequest = `${outagesURL}?api_key=${process.env.API_KEY}`
    return await axios.get<OutageItem[]>(outagesRequest)
}

export const getAllOutages = async (): Promise<RequestResponse> => {
    try {
        const response: AxiosResponse = await requestOutages()

        return {
            success: true,
            status: response.status,
            data: response.data
        } as RequestResponse
    } catch (error) {
        const err = error as AxiosError
        const returnStructure = {
            success: false
        } as RequestResponse

        if (err.response?.status) {
            returnStructure.status = err.response.status
        }

        return returnStructure
    }
}
