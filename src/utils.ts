import { JsonRpcProvider, WebSocketProvider } from "ethers";

export const provider = new WebSocketProvider(process.env.RPC_URL!)