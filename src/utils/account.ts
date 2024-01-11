import { WebSocketProvider, Wallet } from "ethers"

export class Account {
    provider = new WebSocketProvider(process.env.RPC_URL!)
    accountSigner = new Wallet(process.env.PRIVATE_KEY!, this.provider)
    accountAddress = this.accountSigner.address
}
