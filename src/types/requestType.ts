import { OutageItem } from './outageTypes'
import { SiteInfo } from './siteInfoTypes'

export interface RequestResponse {
    success: boolean
    status?: number
    data?: OutageItem[] | SiteInfo
}
