// For the outage items, optional flag allows it to be used for enhanced or raw outages,
// alternatively could have extended the type
export interface OutageItem {
    id: string
    begin: string
    end: string
    name?: string
}
