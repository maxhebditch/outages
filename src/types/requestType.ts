import { OutageItem } from './outageTypes'
import { SiteInfo } from './siteInfoTypes'

// flexible type to handle failed and successful requests for all outages or site info
export interface RequestResponse {
    success: boolean
    status?: number
    data?: OutageItem[] | SiteInfo
}
