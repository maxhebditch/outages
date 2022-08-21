import { SiteInfo } from '../types/siteInfoTypes'
import { RequestResponse } from '../types/requestType'

import axios, { AxiosResponse, AxiosError } from 'axios'
import config from 'config'

export const requestSiteInformation = async (): Promise<AxiosResponse> => {
    const siteInfoURL = `${config.get('API.URL')}${config.get('API.SITE_INFO')}`
    const siteInfoRequest = `${siteInfoURL}?api_key=${process.env.API_KEY}`
    return await axios.get<SiteInfo>(siteInfoRequest)
}

export const getSiteInformation = async (): Promise<RequestResponse> => {
    try {
        const response: AxiosResponse = await requestSiteInformation()

        return {
            success: true,
            status: response.status,
            data: response.data
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
