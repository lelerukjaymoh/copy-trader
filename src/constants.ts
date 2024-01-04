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