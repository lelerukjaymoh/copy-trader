import { parseEther } from "ethers";

enum BUY_AMOUNTS {
    "low" = 0.001,
    "medium" = 0.001,
    "high" = 0.001,
}

const WALLETS_TO_COPY = {
    "0x0Db098Ab5217dbd31aBc417dD71a2a8676398A79": BUY_AMOUNTS.high,
}

export const wallets = Object.fromEntries(
    Object.entries(WALLETS_TO_COPY).map(([key, value]) => [
        key.toLowerCase(),
        parseEther(value.toString())
    ])
);

export const config = {
    slippage: 5n,
}

export const WETH = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
export const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

export const AUTHORIZED_USERS = [
    "" // TODO: set telegram user id here
]


export const TG_ID = ""