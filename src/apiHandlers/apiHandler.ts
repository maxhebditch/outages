import { RequestResponse } from '../types/requestType'

import { AxiosResponse, AxiosError } from 'axios'

export const handleRequest = async (
    getAPI: Promise<AxiosResponse>
): Promise<RequestResponse> => {
    try {
        const response: AxiosResponse = await getAPI

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
