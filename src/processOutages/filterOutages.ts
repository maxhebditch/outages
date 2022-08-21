import { OutageItem } from '../types/outageTypes'
import { SiteInfo } from '../types/siteInfoTypes'
import config from 'config'

export const extractSiteId = (siteInfo: SiteInfo): string[] => {
    return siteInfo.devices.map((device): string => {
        return device.id
    })
}

export const filterEventsBefore = (
    filterDate: Date,
    outageItems: OutageItem[]
): OutageItem[] => {
    return outageItems.filter((event): boolean => {
        return new Date(event.begin).getTime() > filterDate.getTime()
    })
}

export const filterEvents = (outageItems: OutageItem[]): OutageItem[] => {
    // ideally would determine if filter is for events in this calendar year
    const filterDate = new Date(config.get('FILTER.DATE_BEFORE'))
    return filterEventsBefore(filterDate, outageItems)
}
