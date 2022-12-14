import { OutageItem } from '../types/outageTypes'
import { RequestResponse } from '../types/requestType'
import { kfClient } from './kfClient'

import { AxiosResponse, AxiosError } from 'axios'
import config from 'config'

// Uses the authenticated axios client and configured endpoints to post the enhanced results
export const postOutageInformation = async (
    siteId: string,
    outageItems: OutageItem[]
): Promise<AxiosResponse> => {
    const postOutageRequest = `${config.get('API.POST_ENDPOINT')}/${siteId}`
    return await kfClient.post(postOutageRequest, outageItems)
}

// Function to gracefully handle errors when posting to the outage endpoint
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
