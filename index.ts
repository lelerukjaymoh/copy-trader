import { TG_ID, UNISWAP_V2_ROUTER_ADDRESS, WETH, wallets } from "./src/utils/constants";
import { router } from "./src/swap/router";
import { telegramBot } from "./src/telegram/bot";
import { Messages } from "./src/telegram/messages";
import { dpOps } from "./src/db/operations";
import { MaxInt256, WebSocketProvider, parseEther } from "ethers";
import { helper } from "./src/utils/helper";
import { config } from "./src/utils/constants";

const main = async () => {
    const messages = new Messages()

    // start tg bot
    await telegramBot.operate();

    const provider = new WebSocketProvider(process.env.RPC_URL!);

    try {
        const hash = "0xa8771d6f310a46c59178c5275113e4780d32db933af2bd9c875675c555752cbe" // sell
        // const hash = "0xb7af15a2ef3ecbc30627cb68fa4d0ff084eb34185801a32b44ddf49a9b059bcc" // nuy


        console.log("wallets to follow: ", wallets)

        // // provider.on("pending", async (hash: string) => {
        // const txData = await provider.getTransaction(hash);

        // if (txData) {
        //     const { from, data } = txData;

        //     // filter only transactions executed by the wallets we are following
        //     if (from && !wallets.hasOwnProperty(from.toLowerCase())) return;

        //     const methodId = data.slice(0, 10).toLowerCase();
        //     const buyAmount = wallets[from.toLowerCase()]

        //     console.log("methodId: ", methodId);

        //     // Get the trade direction and token
        //     if (methodId == "0x0162e2d0") {
        //         console.log("BUY TRADE: ");

        //         const tokenOutWithZeros = data.substring(data.length - 64);
        //         const tokenInWithZeros = data.substring(
        //             data.length - 128,
        //             data.length - 64
        //         );
        //         const tokenIn = "0x" + tokenInWithZeros.slice(24);
        //         let tokenOut = "0x" + tokenOutWithZeros.slice(24);

        //         // TODO: remove this, only for testing
        //         tokenOut = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";

        //         // If target is buying with unsupported token, eg USDT, USDC, DAI, etc
        //         // TODO: uncomment this bit, commented out to test with WETH on goerli
        //         // if (tokenIn.toLowerCase() != WETH.toLowerCase()) {
        //         //     return await telegramBot.sendNotification(
        //         //         TG_ID,
        //         //         messages.targetBuyingWithUnsupportedToken(from, tokenOut, hash)
        //         //     ).catch(error => console.log("Error sending notification: ", error))
        //         // }

        //         // Return early if buy amount or token where not retrieved
        //         if (!buyAmount || !tokenOut) return;

        //         const txnReceipt = await router.buy(tokenOut, buyAmount, config.slippage);


        //         if (txnReceipt && txnReceipt.status! == 1) {
        //             console.log("Transaction Receipt: ", txnReceipt, tokenOut);

        //             await dpOps.saveTrade(tokenOut, buyAmount, txnReceipt.hash, from, "copy")

        //             await helper.approveToken(tokenOut, UNISWAP_V2_ROUTER_ADDRESS, MaxInt256)
        //                 .catch(error => console.log("Error approving token: ", error))

        //             await telegramBot.sendNotification(
        //                 TG_ID,
        //                 messages.successfulCopyTransactionMessage("Buy", from, tokenOut, txnReceipt.hash)
        //             ).catch(error => console.log("Error sending notification: ", error))
        //         }

        //     } else if (methodId == "0x75713a08") {
        //         console.log("SELL TRADE");

        //         const tokenInWithZeros = data.slice(10, 74);
        //         const tokenOutWithZeros = data.slice(74, 138);
        //         let tokenIn = "0x" + tokenInWithZeros.slice(24);
        //         const tokenOut = "0x" + tokenOutWithZeros.slice(24);

        //         tokenIn = "0x07865c6e87b9f70255377e024ace6630c1eaa37f";

        //         console.log("tokenIn: ", tokenIn);
        //         console.log("tokenOut: ", tokenOut);

        //         const txnReceipt = await router.sell(tokenIn, 100n, config.slippage);

        //         if (txnReceipt && txnReceipt.status! == 1) {
        //             console.log("Transaction Receipt: ", txnReceipt);

        //             await telegramBot.sendNotification(
        //                 TG_ID,
        //                 messages.successfulCopyTransactionMessage("Sell", from, tokenOut, txnReceipt.hash)
        //             )
        //         }
        //     }
        // }
        // });
    } catch (error) {
        console.log(error);
    }
};

main();
