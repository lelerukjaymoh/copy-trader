// import { Interface, Wallet, WebSocketProvider, ZeroAddress, parseEther } from "ethers";
// import DATA_ABI from "../abi/getData.json";
// import { getDataByteCode } from "../abi/bytecode";

// export const provider = new WebSocketProvider(process.env.RPC_URL!)

// export const getContractData = async (tokenIn: string, tokenOut: string, account: string, amountIn: bigint) => {
//     try {

//         account = "0x889618ad027B09C0B39Ac50680980C025bdB141E"
//         tokenIn = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
//         tokenOut = "0x2a8d8fcb18d132d77373eb02b22d8e7d378F4437"
//         amountIn = 1000000000000000000n

//         const data = await provider.send("eth_call", [
//             {
//                 to: "0xCf3E7d1b849c236b03B3606FcE766db0eB182eD1",
//                 data: dataInterface.encodeFunctionData("getData", [account, tokenIn, tokenOut, parseEther("1")]),
//             },
//             "pending",
//             {
//                 ["0xCf3E7d1b849c236b03B3606FcE766db0eB182eD1"]: {
//                     code: getDataByteCode
//                 }
//             }
//         ])

//         console.log("data: ", data)

//         const decodedData = dataInterface.decodeFunctionResult("getData", data)

//         console.log("decodedData: ", decodedData)

//     } catch (error) {
//         console.log("Error getting contract data: ", error)
//     }
// }

// const dataInterface = new Interface(DATA_ABI)