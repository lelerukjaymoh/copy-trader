export interface TGRequestInput {
    action: string,
    token: string,
    amount?: string,
    slippage?: bigint
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
    tradeType: string
}