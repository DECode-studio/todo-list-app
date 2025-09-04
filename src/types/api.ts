export type ApiResponse<T = unknown> = {
    status?: Status
    data?: T | null
}

export type Status = {
    code?: number
    message?: string
}