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
            return { error: true, reason: "Invalid action provided in the request. Action can either be buy or sell. Click /help to see the right format " }
        }

        if (!inputParams[1].match(/^(0x)?[0-9a-fA-F]{40}$/)) {
            return { error: true, reason: "Invalid token provided in the request. Token address example 0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2. Click /help to see the right format " }
        }

        if (typeof parseInt(inputParams[2]) != "number") {
            return { error: true, reason: "Invalid amount provided in the request. Amount must be a number. Click /help to see the right format " }
        }

        if (typeof parseInt(inputParams[3]) != "number") {
            return { error: true, reason: `Invalid slippage provided (<pre>${inputParams[3]}</pre>) in the request. Amount must be a number. Click /help to see the right format ` }
        }

        // check if set slippage is greater than 70. This should not be allowed
        if (parseInt(inputParams[3]) > 70) {
            return { error: true, reason: `Slippage of more than 70% is not allowed (<pre>${inputParams[3]}</pre>).` }
        }


        const data: TGRequestInput = {
            action: inputParams[0],
            token: inputParams[1],
            amount: inputParams[2],
            slippage: inputParams[3]
        }

        return data
    }
}

export const verifyInput = new VerifyInput();