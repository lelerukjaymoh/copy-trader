export interface TGRequestInput {
    action: string,
    token: string,
    amount?: string,
    slippage?: string
}
export interface TGRequestInputError {
    error: boolean,
    reason: string
}