import { SiteInfo } from '../types/siteInfoTypes'
import { RequestResponse } from '../types/requestType'

import axios, { AxiosResponse, AxiosError } from 'axios'
import config from 'config'

export const requestSiteInformation = async (): Promise<AxiosResponse> => {
    const siteInfoURL = `${config.get('API.URL')}${config.get('API.SITE_INFO')}`
    const siteInfoRequest = `${siteInfoURL}?api_key=${process.env.API_KEY}`
    return await axios.get<SiteInfo>(siteInfoRequest)
}

export const getSiteInformation = (): void => {
    return
}
