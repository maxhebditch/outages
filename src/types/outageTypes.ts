export interface OutageItem {
    id: string
    begin: string
    end: string
}

export interface OutageResponse {
    success: boolean
    status?: number
    data?: OutageItem[]
}
