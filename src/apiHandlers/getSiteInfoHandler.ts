import { SiteInfo } from '../types/siteInfoTypes'
import { RequestResponse } from '../types/requestType'
import { handleRequest } from '../apiHandlers/apiHandler'
import { kfClient } from './kfClient'

import { AxiosResponse } from 'axios'
import config from 'config'

// Uses the authenticated axios client and configured endpoints to get specific site information
export const requestSiteInformation = async (
    siteId: string
): Promise<AxiosResponse> => {
    const siteInfoRequest = `${config.get('API.SITE_INFO')}/${siteId}`
    return await kfClient.get<SiteInfo>(siteInfoRequest)
}

// Wrapper using the generic handleRequest function, and passing it the 
// output from the specific API request with siteId
export const getSiteInformation = async (
    siteId: string
): Promise<RequestResponse> => {
    return handleRequest(requestSiteInformation(siteId))
}
