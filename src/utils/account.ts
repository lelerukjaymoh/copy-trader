import { WebSocketProvider, Wallet, JsonRpcProvider } from "ethers"

export class Account {
    provider = new JsonRpcProvider(process.env.TESTNET_RPC_URL!) // TODO: revert to mainnet rpc on going live
    accountSigner = new Wallet(process.env.PRIVATE_KEY!, this.provider)
    accountAddress = this.accountSigner.address
}
