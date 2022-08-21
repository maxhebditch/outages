import { OutageItem, OutageResponse } from '../types/outageTypes'
import axios, { AxiosResponse, AxiosError } from 'axios'
import config from 'config'

export const requestOutages = async (): Promise<AxiosResponse> => {
    const outagesURL = `${config.get('API.URL')}${config.get(
        'API.OUTAGES_ENDPOINT'
    )}`
    const outagesRequest = `${outagesURL}?api_key=${process.env.API_KEY}`
    return await axios.get<OutageItem[]>(outagesRequest)
}

export const getAllOutages = async (): Promise<OutageResponse> => {
    try {
        const response: AxiosResponse = await requestOutages()

        return {
            success: true,
            status: response.status,
            data: response.data
        } as OutageResponse
    } catch (error) {
        const err = error as AxiosError
        const returnStructure = {
            success: false
        } as OutageResponse

        if (err.response?.status) {
            returnStructure.status = err.response.status
        }

        return returnStructure
    }
}
