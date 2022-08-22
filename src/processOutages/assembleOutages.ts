import { OutageItem } from '../types/outageTypes'
import { SiteInfo } from '../types/siteInfoTypes'

// Creates a map of Id to name for looking up what name should be used to enhance outage events
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

// Uses the k:v of id:name to add the name to the event
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

// first generates the map of id to names and then adds them to the event
export const assembleOutages = (
    siteInfo: SiteInfo,
    outageItems: OutageItem[]
): OutageItem[] => {
    const idToName = mapIdToName(siteInfo)
    return addNameToEvent(idToName, outageItems)
}
