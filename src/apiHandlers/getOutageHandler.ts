import { OutageItem } from '../types/outageTypes'
import { RequestResponse } from '../types/requestType'
import { handleRequest } from '../apiHandlers/apiHandler'
import { kfClient } from './kfClient'

import { AxiosResponse } from 'axios'
import config from 'config'

// Uses the authenticated axios client and configured endpoints to get all outages
export const requestOutages = async (): Promise<AxiosResponse> => {
    const outageRequest = `${config.get('API.OUTAGES_ENDPOINT')}`
    return await kfClient.get<OutageItem[]>(outageRequest)
}

// Wrapper using the generic handleRequest function, and passing it the 
// output from the specific API request
export const getAllOutages = async (): Promise<RequestResponse> => {
    return handleRequest(requestOutages())
}
