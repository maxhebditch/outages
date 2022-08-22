import { OutageItem } from '../types/outageTypes'
import { SiteInfo } from '../types/siteInfoTypes'

export const mapIdToName = (siteInfo: SiteInfo): Record<string, string> => {
    return siteInfo.devices.reduce<Record<string, string>>(
        (map, item): Record<string, string> => {
            if (!Object.keys(map).includes(item.id)) {
                map[item.id] = item.name
            }
            return map
        },
        {}
    )
}

export const addNameToEvent = (
    idToName: Record<string, string>,
    outageItems: OutageItem[]
): OutageItem[] => {
    return JSON.parse(JSON.stringify(outageItems)).map(
        (event: OutageItem): OutageItem => {
            return {
                id: event.id,
                name: idToName[event.id],
                begin: event.begin,
                end: event.end
            } as OutageItem
        }
    )
}

export const assembleOutages = (
    siteInfo: SiteInfo,
    outageItems: OutageItem[]
): OutageItem[] => {
    const idToName = mapIdToName(siteInfo)
    return addNameToEvent(idToName, outageItems)
}
