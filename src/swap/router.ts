import { Contract, MaxInt256, ethers, parseEther, parseUnits } from "ethers";

import { TG_ID, UNISWAP_V2_ROUTER_ADDRESS, WETH, config } from "../utils/constants";
import { Account } from "../utils/account";
import { helper } from "../utils/helper";
import { telegramBot } from "../telegram/bot";
import { Messages } from "../telegram/messages";

class Router extends Account {
    uniswapV2Router: Contract
    messages: Messages

    constructor() {
        super()

        this.uniswapV2Router = helper.getRouterContract(UNISWAP_V2_ROUTER_ADDRESS);
        this.messages = new Messages();
    }

    buy = async (tokenAddress: string, buyAmount: bigint, slippage: bigint) => {
        try {
            // Get all required data before swap 
            const path = [WETH, tokenAddress];
            const deadline = Math.floor(Date.now() / 1000) + 60 * 2;

            console.log("buyAmount: ", buyAmount);
            console.log("weth ", WETH);
            console.log("tokenAddress ", tokenAddress);
            console.log("account ", this.accountAddress);

            const amounts = await helper.amountOutMin(buyAmount, path);

            if (!amounts) return;

            const amountOutMin = amounts! * (100n - slippage) / 100n;

            console.log("Amount out min ", amountOutMin);
            const transactionResponse: ethers.TransactionResponse = await this.uniswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens(
                amountOutMin,
                path,
                this.accountAddress,
                deadline,
                {
                    value: buyAmount,
                }
            );
            console.log(transactionResponse);

            return await transactionResponse.wait();
        } catch (error) {
            console.log(error);
        }
    }

    sell = async (tokenAddress: string, percentageSell: bigint, slippage: bigint) => {
        try {
            console.log("tokenAddress: ", tokenAddress);

            await helper.approveToken(tokenAddress, UNISWAP_V2_ROUTER_ADDRESS, MaxInt256);

            const tokenContract = helper.getTokenContract(tokenAddress);
            const path = [tokenAddress, WETH];
            const tokenBalance = await tokenContract.balanceOf(this.accountAddress);

            const deadline = Math.floor(Date.now() / 1000) + 60 * 2;

            const amountIn = tokenBalance * percentageSell / 100n;
            const amounts = await helper.amountOutMin(amountIn, path);

            if (!amounts) return;

            const amountOutMin = amounts! * (100n - slippage) / 100n;

            console.log("amountIn: ", amountIn.toString());
            console.log("amountOutMin: ", amountOutMin);
            console.log("path: ", path);
            console.log("signer.address: ", this.accountAddress);

            const transactionResponse = await this.uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens(
                amountIn,
                amountOutMin,
                path,
                this.accountAddress,
                deadline,
            );

            console.log(transactionResponse);

            return await transactionResponse.wait();
        } catch (error) {
            console.log("sell error: ", error);
        }
    }


}

export const router = new Router();