import { SiteInfo } from '../types/siteInfoTypes'
import { RequestResponse } from '../types/requestType'
import { handleRequest } from '../apiHandlers/apiHandler'
import { kfClient } from './kfClient'

import { AxiosResponse } from 'axios'
import config from 'config'

export const requestSiteInformation = async (
    siteId: string
): Promise<AxiosResponse> => {
    const siteInfoRequest = `${config.get('API.SITE_INFO')}/${siteId}`
    return await kfClient.get<SiteInfo>(siteInfoRequest)
}

export const getSiteInformation = async (
    siteId: string
): Promise<RequestResponse> => {
    return handleRequest(requestSiteInformation(siteId))
}
