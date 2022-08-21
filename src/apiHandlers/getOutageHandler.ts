import { OutageItem, OutageResponse } from "../types/outageTypes"
import axios from 'axios'
import config from 'config'

export const requestOutages = async(): Promise<OutageItem[]> => {
    const outagesURL = `${config.get('API.URL')}${config.get('API.OUTAGES_ENDPOINT')}`
    const { data, status } = await axios.get<OutageItem[]>(outagesURL)
    return data
}

export const getAllOutages = async(): Promise<OutageResponse> => {
    let outageData : OutageItem[];

    try {
        outageData = await requestOutages()
    } catch(err) {
        outageData = [{}] as OutageItem[]
    }
    return {
        status: 200,
        data: outageData
    }
}
