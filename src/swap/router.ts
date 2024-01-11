import { Contract, ethers, parseEther, parseUnits } from "ethers";

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

    buy = async (tokenAddress: string, amount: bigint) => {
        try {
            // Get all required data before swap 
            const path = [WETH, tokenAddress];
            const deadline = Math.floor(Date.now() / 1000) + 60 * 2;
            const buyAmount = parseEther(amount.toString());

            console.log("buyAmount: ", buyAmount);
            console.log("weth ", WETH);
            console.log("tokenAddress ", tokenAddress);
            console.log("account ", this.accountAddress);

            const amounts = await helper.amountOutMin(buyAmount, path);

            const amountOutMin = amounts! * (100n - config.slippage) / 100n;

            console.log("Amount out min ", amountOutMin);
            const transactionResponse: ethers.TransactionResponse = await this.uniswapV2Router.swapExactETHForTokensSupportingFeeOnTransferTokens.staticCall(
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

    sell = async (token: string, percentageSell: bigint) => {
        try {

            const tokenContract = helper.getTokenContract(token);

            const path = [token, WETH];
            const tokenDecimals = await tokenContract.decimals();
            const tokenBalance = await tokenContract.balanceOf(this.accountAddress);

            const amount = tokenBalance * percentageSell / 100n;

            const amountIn = parseUnits(amount.toString(), tokenDecimals);
            const amounts = await helper.amountOutMin(amountIn, path);

            const amountOutMin = amounts! * (100n - config.slippage) / 100n;

            console.log("amountIn: ", amountIn.toString());
            console.log("amountOutMin: ", amountOutMin);
            console.log("path: ", path);
            console.log("signer.address: ", this.accountAddress);

            const transactionResponse = await this.uniswapV2Router.swapExactTokensForETHSupportingFeeOnTransferTokens.staticCall(
                amountIn,
                amountOutMin,
                path,
                this.accountAddress
            );

            console.log(transactionResponse);

            return await transactionResponse.wait();
        } catch (error) {
            console.log("sell error: ", error);
        }
    }


}

export const router = new Router();