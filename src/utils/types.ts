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

export interface ITrade {
    token: string,
    amount: bigint,
    txHash: string,
    target: string,
}