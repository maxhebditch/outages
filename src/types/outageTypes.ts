export interface OutageItem {
    id: string
    begin: string
    end: string
}

export interface OutageResponse {
    status: number
    data: OutageItem[]
}
