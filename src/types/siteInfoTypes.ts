export interface SiteInfo {
    id: string
    name: string
    devices: SiteDevice[]
}

export interface SiteDevice {
    id: string
    name: string
}
