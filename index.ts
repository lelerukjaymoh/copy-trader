import { TG_ID, WETH, wallets } from "./src/utils/constants";
import { router } from "./src/swap/router";
import { provider } from "./src/utils/fetchContractData";
import { telegramBot } from "./src/telegram/bot";
import { Messages } from "./src/telegram/messages";
import { dpOps } from "./src/db/operations";
import { parseEther } from "ethers";

const main = async () => {
    const messages = new Messages()
    try {
        const hash = "0xb7af15a2ef3ecbc30627cb68fa4d0ff084eb34185801a32b44ddf49a9b059bcc"

        console.log("wallets to follow: ", wallets)

        // provider.on("pending", async (hash: string) => {
        const txData = await provider.getTransaction(hash);

        if (txData) {
            const { from, data } = txData;

            // filter only transactions executed by the wallets we are following
            if (from && !wallets.hasOwnProperty(from.toLowerCase())) return;

            const methodId = data.slice(0, 10).toLowerCase();

            console.log("methodId: ", methodId);

            // Get the trade direction and token
            if (methodId == "0x0162e2d0") {
                console.log("BUY TRADE: ");

                const tokenOutWithZeros = data.substring(data.length - 64);
                const tokenInWithZeros = data.substring(
                    data.length - 128,
                    data.length - 64
                );
                const tokenIn = "0x" + tokenInWithZeros.slice(24);
                const tokenOut = "0x" + tokenOutWithZeros.slice(24);

                // If target is buying with unsupported token, eg USDT, USDC, DAI, etc
                if (tokenIn.toLowerCase() != WETH.toLowerCase()) {
                    return await telegramBot.sendNotification(
                        TG_ID,
                        messages.targetBuyingWithUnsupportedToken(from, tokenOut, hash)
                    )
                }

                const buyAmount = parseEther(wallets[from.toLowerCase()].toString());

                const txnReceipt = await router.buy(tokenOut, buyAmount);

                console.log("Transaction Receipt: ", txnReceipt);

                if (txnReceipt && txnReceipt.status! == 1) {

                    await dpOps.saveTrade(tokenOut, buyAmount, txnReceipt.hash, from)

                    await telegramBot.sendNotification(
                        TG_ID,
                        messages.successfulCopyTransactionMessage("Buy", from, tokenOut, txnReceipt.hash)
                    )
                }

            } else if (methodId == "0x75713a08") {
                console.log("SELL TRADE");

                const tokenInWithZeros = data.slice(10, 74);
                const tokenOutWithZeros = data.slice(74, 138);
                const tokenIn = "0x" + tokenInWithZeros.slice(24);
                const tokenOut = "0x" + tokenOutWithZeros.slice(24);


                console.log("tokenIn: ", tokenIn);
                console.log("tokenOut: ", tokenOut);

                const txnReceipt = await router.sell(tokenOut, 100n);

                console.log("Transaction Receipt: ", txnReceipt);

                if (txnReceipt && txnReceipt.status! == 1) {
                    await telegramBot.sendNotification(
                        TG_ID,
                        messages.successfulCopyTransactionMessage("Sell", from, tokenOut, txnReceipt.hash)
                    )
                }
            }
        }
        // });
    } catch (error) {
        console.log(error);
    }
};

main();
