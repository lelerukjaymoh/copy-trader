import { Contract, TransactionResponse } from "ethers"
import { Account } from "./account"
import { UNISWAP_V2_ROUTER_ADDRESS, config } from "./constants";

import ROUTER_ABI from "../abi/uniswapRouter.json";
import TOKEN_ABI from "../abi/token.json";

class Helper extends Account {
    uniswapV2Router: Contract

    constructor() {
        super()

        this.uniswapV2Router = this.getRouterContract(UNISWAP_V2_ROUTER_ADDRESS);
    }

    amountOutMin = async (amountIn: bigint, path: string[]) => {
        try {
            const amountsOut = await this.uniswapV2Router.getAmountsOut(amountIn, path)

            console.log("Amount out ", amountsOut, parseInt(amountsOut[1]))

            return amountsOut[1] * (100n - config.slippage) / 100n;

        } catch (error) {
            console.error("Error calculating eth amount out ", error)
        }
    }

    tokenBalance = async (tokenAddress: string, account: string): Promise<bigint | undefined> => {
        try {
            return await this.getTokenContract(tokenAddress).balanceOf(account)
        } catch (error) {
            console.log("Error getting eth token balance ", error)
        }
    }

    tokenAllowance = async (tokenAddress: string, spender: string, owner: string) => {
        try {
            const allowance = await this.getTokenContract(tokenAddress).allowance(owner, spender)
            return { success: true, data: allowance }
        } catch (error) {
            console.log("Error getting eth token allowance ", error)
            return { success: false, data: error }

        }
    }


    getRouterContract = (tokenAddress: string) => {
        return new Contract(
            tokenAddress,
            ROUTER_ABI,
            this.accountSigner
        );
    }

    getTokenContract = (tokenAddress: string) => {
        return new Contract(
            tokenAddress,
            TOKEN_ABI,
            this.accountSigner

        );
    }


    // Checks if token is already approved before approving 
    approveToken = async (tokenAddress: string, spender: string, amount: bigint) => {
        try {
            // Check allowance
            const allowance = await helper.tokenAllowance(tokenAddress, UNISWAP_V2_ROUTER_ADDRESS, this.accountAddress);

            console.log("allowance: ", allowance);

            if (Number(allowance) && Number(allowance) == 0) {
                const tokenContract = this.getTokenContract(tokenAddress)
                const tx = await tokenContract.approve(spender, amount)

                return tx
            }
        } catch (error) {
            console.log("Error approving token ", error)
        }
    }
}

export const helper = new Helper()