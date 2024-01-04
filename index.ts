import { wallets } from "./src/constants";
import { provider } from "./src/utils";

const main = async () => {
    try {
        const hash = "0xf5b18590364560657e48453d77be49ceb6a2ad411b120667b025ac04152f8bbb"

        console.log("wallets to follow: ", wallets)

        // provider.on("pending", async (hash: string) => {
        const txData = await provider.getTransaction(hash);

        if (txData) {
            const { from, data } = txData;

            // filter only transactions executed by the wallets we are following
            if (from && !wallets.hasOwnProperty(from.toLowerCase())) return;

            const methodId = data.slice(0, 10).toLowerCase();

            // Get the trade direction and token
            if (methodId == "0x0162e2d0") {
                console.log("BUY TRADE: ", hash, txData);

                const tokenOutWithZeros = data.substring(data.length - 64);
                const tokenInWithZeros = data.substring(
                    data.length - 128,
                    data.length - 64
                );
                const tokenIn = "0x" + tokenInWithZeros.slice(24);
                const tokenOut = "0x" + tokenOutWithZeros.slice(24);

                console.log("tokenIn: ", tokenIn);
                console.log("tokenOut: ", tokenOut);

            } else if (methodId == "0x75713a08") {
                console.log("SELL TRADE: ", hash, txData);

                const tokenInWithZeros = data.slice(10, 74);
                const tokenOutWithZeros = data.slice(74, 138);
                const tokenIn = "0x" + tokenInWithZeros.slice(24);
                const tokenOut = "0x" + tokenOutWithZeros.slice(24);


                console.log("tokenIn: ", tokenIn);
                console.log("tokenOut: ", tokenOut);
            }
        }
        // });
    } catch (error) {
        console.log(error);
    }
};

main();
