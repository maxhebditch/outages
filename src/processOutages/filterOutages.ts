import { OutageItem } from '../types/outageTypes'

export const filterEventsBefore = (
    filterDate: Date,
    outageItems: OutageItem[]
): OutageItem[] => {
    return outageItems.filter((event) : boolean => {
        return new Date(event.begin).getTime() > filterDate.getTime()
    })
}
