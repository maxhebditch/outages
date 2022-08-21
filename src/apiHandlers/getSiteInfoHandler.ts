import { SiteInfo } from '../types/siteInfoTypes'
import { RequestResponse } from '../types/requestType'
import { handleRequest } from '../apiHandlers/apiHandler'

import axios, { AxiosResponse } from 'axios'
import config from 'config'

export const requestSiteInformation = async (
    siteId: string
): Promise<AxiosResponse> => {
    const siteInfoURL = `${config.get('API.URL')}${config.get('API.SITE_INFO')}`
    const siteInfoRequest = `${siteInfoURL}/${siteId}?api_key=${process.env.API_KEY}`
    return await axios.get<SiteInfo>(siteInfoRequest)
}

export const getSiteInformation = async (
    siteId: string
): Promise<RequestResponse> => {
    return handleRequest(requestSiteInformation(siteId))
}
