import { OutageItem } from '../types/outageTypes'
import { RequestResponse } from '../types/requestType'

import axios, { AxiosResponse, AxiosError } from 'axios'
import config from 'config'

export const postOutageInformation = async (
    siteId: string,
    outageItems: OutageItem[]
): Promise<AxiosResponse> => {
    const postOutageURL = `${config.get('API.URL')}${config.get(
        'API.POST_ENDPOINT'
    )}`
    const postOutageRequest = `${postOutageURL}/${siteId}?api_key=${process.env.API_KEY}`
    return await axios.post<OutageItem[]>(postOutageRequest, outageItems)
}

export const handlePostOutage = async (
    siteId: string,
    outageItems: OutageItem[]
): Promise<RequestResponse> => {
    try {
        const response: AxiosResponse = await postOutageInformation(
            siteId,
            outageItems
        )
        return {
            success: true,
            status: response.status
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
