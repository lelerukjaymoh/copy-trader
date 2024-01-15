import { parseEther } from "ethers";
import { TGRequestInput, TGRequestInputError } from "./types";

class VerifyInput {
    constructor() {
    }


    /**
     * Checks for errors and cleans the inputs
     * @param inputParams an array of params that user includes in the request [tradeDirection, token, amount, slippage]
     * 
     * @returns 
     */
    checkTGInput = (inputText: string): TGRequestInput | TGRequestInputError => {
        let inputParams = inputText.split(",");

        inputParams = inputParams.map((items: string) => {
            return items.trim().toLowerCase();
        })

        if (inputParams.length < 2) {
            return { error: true, reason: "Invalid request format provided. Click /help to see the right format " }
        }

        if (inputParams[0] != "buy" && inputParams[0] != "sell" && inputParams[0] != "approve") {
            return { error: true, reason: "Invalid action provided in the request. Action can either be BUY, SELL or APPROVE. \n\nClick /help to see the right format " }
        }

        if (!this.isAddressLike(inputParams[1])) {
            return { error: true, reason: `Invalid token provided in the request. \n\nHere is an example of a token address <code>0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2</code>. \n\nClick /help to see the right ${inputParams[0].toUpperCase()} command format` }
        }

        if (!this.isNumeric(inputParams[2])) {
            return { error: true, reason: "Invalid amount provided in the request. Amount must be a number. Click /help to see the right format " }
        }

        if (!this.isNumeric(inputParams[3])) {
            return { error: true, reason: `Invalid slippage provided in the request. Amount must be a number. Click /help to see the right format ` }
        }

        // check if set slippage is greater than 70. This should not be allowed
        if (parseInt(inputParams[3]) > 70) {
            return { error: true, reason: `Slippage of more than 70% is not allowed (<pre>${inputParams[3]}</pre>).` }
        }

        if (parseInt(inputParams[3]) < 1) {
            return { error: true, reason: `Slippage less than 1% is not allowed (<pre>${inputParams[3]}</pre>).` }
        }

        const data: TGRequestInput = {
            action: inputParams[0],
            token: inputParams[1],
            amount: inputParams[2],
            slippage: BigInt(inputParams[3])
        }

        console.log("Data ", data)

        return data
    }

    isNumeric(input: string) {
        console.log("Input ", input)
        const regex = /^[0-9]+(\.[0-9]+)?$/;
        return regex.test(input);
    }

    isAddressLike(input: string) {
        const regex = /^(0x)?[0-9a-fA-F]{40}$/;
        return regex.test(input);
    }

}

export const verifyInput = new VerifyInput();