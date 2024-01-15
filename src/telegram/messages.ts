export class Messages {
    constructor() {
    }

    startMessage = () => {
        let message = "Welcome To Copy Bot"

        return message
    }

    helpMessage = () => {
        let message = "Copy Bot User Guide"
        message += "\n\n\nBuy"
        message += "\naction, token address, amount, slippage percentage"
        message += "\n\nExample Buy"
        message += "\nbuy, 0x889b294a7d8a1ef65aabbfa95e47b9c3c202f55d, 0.000001, 5"

        message += "\n\n\nSell"
        message += "\naction, token address, percentage to sell (100 to sell the whole amount), slippage percentage"
        message += "\n\nExample Sell"
        message += "\nsell, 0x889b294a7d8a1ef65aabbfa95e47b9c3c202f55d, 100, 5"

        message += "\n\n\nApprove"
        message += "\napprove, token address"
        message += "\n\nExample Approve"
        message += "\napprove, 0x889b294a7d8a1ef65aabbfa95e47b9c3c202f55d"

        message += "\n\n\n - <i>In case the bot is not responsive, click /restart to restart it</i>"
        message += "\n - <i>click /help to display this message</i>"

        return message
    }

    unAuthorizedAccessMessage = () => {
        let message = "Error "
        message += "You are not AUTHORIZED to use this bot. If this is an error contact <a href='https://t.me/Ox6a6179'> JAY </a>  "

        return message
    }

    inputErrorMessage = (error: string) => {
        let message = "Invalid command provided "
        message += "\n\n Error"
        message += `\n${error}`

        return message
    }

    successfulTransactionMessage = (action: string, token: string, txHash: string) => {
        const explorer = "https://goerli.etherscan.io/"

        let message = `Successful ${action} Transaction`
        message += "\n\nToken"
        message += `\n<a href="${explorer}/token/${token}">${token}</a>`
        message += "\n\n Transaction"
        message += `\n<a href="${explorer}/tx/${txHash}">${txHash}</a>`

        console.log("\n\n Message ", message)

        return message
    }

    unSuccessfulTransactionMessage = (token: string, txHash: string) => {
        const explorer = "https://goerli.etherscan.io/"

        let message = "Failed Transaction"
        message += "\n\nToken"
        message += `\n <a href="${explorer}/token/${token}">${token}</a>`
        message += "\n\n Transaction"
        message += `\n<a href="${explorer}/tx/${txHash}">${txHash}</a>`

        return message
    }

    unSuccessfulTransactionBroadcastMessage = (token: string, reason: string) => {
        const explorer = "https://goerli.etherscan.io/"

        let message = "Failed Transaction"
        message += "\n\nToken"
        message += `\n <a href="${explorer}/token/${token}">${token}</a>`
        message += "\n\n Reason"
        message += `\n${reason}`

        return message
    }

    successfulApproval = (token: string, txHash: string,) => {
        const explorer = "https://goerli.etherscan.io/"

        let message = "Approval Successful"
        message += "\n\nToken"
        message += `\n <a href="${explorer}/token/${token}">${token}</a>`
        message += "\n\nTransaction"
        message += `\n<a href="${explorer}/tx/${txHash}">${txHash}</a>`

        return message
    }

    unSuccessfulApproval = (token: string) => {
        let message = "Failed to Approve token"
        message += `\n\n You may need to approve it manually by clicking on this link /approve, ${token}`
        message += "\n\n For example"
        message += "\neth, approve, 0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"

        return message
    }

    zeroBalance = (token: string, wallet: string) => {
        const explorer = "https://goerli.etherscan.io/"

        let message = "Zero Token Balance"
        message += "\n\n Wallet does not hold this token"
        message += "\n\nToken"
        message += `\n <a href="${explorer}/token/${token}?a=${wallet}">${token}</a>`

        return message
    }

    failedTxMessage = (txType: string, token: string, error: any) => {

        error = JSON.parse(error)

        let message = `Failed to broadcast a ${txType}`
        message += `\n\n\ Token: https://goerli.etherscan.io//address/${token}`
        message += `\n\n Error reason`
        message += `\n ${error.code} : ${error.reason}`
        message += `\n\n\n Transaction Data`
        message += `\n <pre>${error.args ? JSON.stringify(error.args) : JSON.stringify(error)}</pre>`

        return message
    }

    tokenTaxMessage = (token: string, buyTax: number, sellTax: number) => {
        let message = "Token Tax is more than our maximum allowed tax"
        message += `\n\nToken`
        message += `\n${token}`
        message += `\n\nBuy Tax`
        message += `\n${buyTax}`
        message += `\n\nSell Tax`
        message += `\n${sellTax}`
        message += `\n\nhttps://honeypot.is/ethereum?address=${token}`

        return message
    }

    targetBuyingRugToken = (target: string, token: string) => {
        let message = "Target is buying a honeyPot"
        message += `\n\nToken`
        message += `\n${token}`
        message += `\n\nTarget`
        message += `\n${target}`

        return message
    }

    highTax = (buyTax: number, sellTax: number) => {
        let message = "Target is buying a token with high tax"
        message += `\n\nBuy Tax: ${buyTax}`
        message += `\n\nSell Tax: ${sellTax}`

        return message
    }

    unSuccessfulCopyApproval = (token: string) => {
        let message = "Failed to Approve token"
        message += `\n\n ${token}`

        return message
    }

    successfulCopyApproval = (token: string, txHash: string,) => {
        let message = "Approval Successful"
        message += "\n\nToken"
        message += `\n <a href="https://goerli.etherscan.io//token/${token}">${token}</a>`
        message += "\n\nTransaction"
        message += `\n<a href="https://goerli.etherscan.io//tx/${txHash}">${txHash}</a>`

        return message
    }

    successfulCopyTransactionMessage = (action: string, target: string, token: string, txHash: string) => {

        let message = `Successfully Copied ${action} Transaction`
        message += "\n\nTarget"
        message += `\n<a href="https://goerli.etherscan.io//address/${target}">${target}</a>`
        message += "\n\nToken"
        message += `\n<a href="https://goerli.etherscan.io//token/${token}">${token}</a>`
        message += "\n\n Transaction"
        message += `\n<a href="https://goerli.etherscan.io//tx/${txHash}">${txHash}</a>`

        console.log("\n\n Message ", message)

        return message
    }

    tokenAlreadyApproved = (token: string) => {
        let message = "Token already approved"
        message += `\n\nToken`
        message += `\n${token}`

        return message
    }

    targetBuyingWithUnsupportedToken = (target: string, token: string, txHash: string) => {
        let message = "Target buying with unsupported token"
        message += "\n\nTarget"
        message += `\n<a href="https://goerli.etherscan.io//address/${target}">${target}</a>`
        message += "\n\nToken"
        message += `\n<a href="https://goerli.etherscan.io//token/${token}">${token}</a>`
        message += "\n\n Transaction"
        message += `\n<a href="https://goerli.etherscan.io//tx/${txHash}">${txHash}</a>`

        console.log("\n\n Message ", message)

        return message
    }

    errorFetchingTokenAllowance = (token: string, reason: any) => {
        let message = "Error fetching token allowance"
        message += "\n\nToken"
        message += `\n${token}`
        message += "\n\nReason"
        message += `\n<pre>${reason}</pre>`

        return message
    }
}

export const telegramMessage = new Messages()