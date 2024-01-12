import { parseEther } from "ethers";

enum BUY_AMOUNTS {
    "low" = 0.00001,
    "medium" = 0.00001,
    "high" = 0.000001,
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

export const WETH = "0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
export const UNISWAP_V2_ROUTER_ADDRESS = "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D"

export const AUTHORIZED_USERS = [
    "584173555" // TODO: set telegram user id here
]


export const TG_ID = "-4025061989"