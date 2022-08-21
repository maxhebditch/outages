import { OutageItem, OutageResponse } from '../types/outageTypes'
import axios, { AxiosResponse } from 'axios'
import config from 'config'

export const requestOutages = async (): Promise<AxiosResponse> => {
    const outagesURL = `${config.get('API.URL')}${config.get(
        'API.OUTAGES_ENDPOINT'
    )}`
    const outagesRequest = `${outagesURL}?api_key=${process.env.API_KEY}`
    return await axios.get<OutageItem[]>(outagesRequest)
}

export const getAllOutages = async (): Promise<OutageResponse> => {
    const { data, status } = await requestOutages()
    return {
        status: status,
        data: data
    } as OutageResponse
}
