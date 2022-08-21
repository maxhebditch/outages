import { OutageItem } from '../types/outageTypes'
import { RequestResponse } from '../types/requestType'
import { handleRequest } from '../apiHandlers/apiHandler'
import { kfClient } from './kfClient'

import { AxiosResponse } from 'axios'
import config from 'config'

export const requestOutages = async (): Promise<AxiosResponse> => {
    const outageRequest = `${config.get('API.OUTAGES_ENDPOINT')}`
    return await kfClient.get<OutageItem[]>(outageRequest)
}

export const getAllOutages = async (): Promise<RequestResponse> => {
    return handleRequest(requestOutages())
}
