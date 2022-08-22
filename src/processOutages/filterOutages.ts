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
    // deep copy of the original events before filtering to make testing easier
    const returnItems = JSON.parse(JSON.stringify(outageItems))
    return returnItems.filter((event: OutageItem): boolean => {
        return new Date(event.begin).getTime() > filterDate.getTime()
    })
}

export const filterEventsWithIds = (
    ids: string[],
    outageItems: OutageItem[]
): OutageItem[] => {
    return outageItems.filter((event: OutageItem): boolean => {
        return ids.includes(event.id)
    })
}

export const filterEventsByTimeAndId = (
    siteInfo: SiteInfo,
    outageItems: OutageItem[]
): OutageItem[] => {
    // ideally would determine if filter is for events in this calendar year
    const filterDate = new Date(config.get('FILTER.DATE_BEFORE'))
    const ids = extractSiteId(siteInfo)
    // will filter outages sequentially to save time but would also be nice to filter separately then compare
    const outagesByTime = filterEventsBefore(filterDate, outageItems)
    const outagesByTimeAndId = filterEventsWithIds(ids, outagesByTime)
    return outagesByTimeAndId
}
