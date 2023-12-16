import { provider } from "./src/utils";

const main = async () => {
    try {
        console.log("chain ", await provider.getNetwork())

        const hash = "0xa34ec2da4136a9107cdd71533070a5300d3590d6c7c59e168980fde2e64779b4"

        // provider.on("pending", async (hash: string) => {
        const txData = await provider.getTransaction(hash)

        console.log("txData", txData)

        if (txData) {
            const { to, from, data } = txData!

            await provider
                .send("debug_traceCall", [
                    { to, from, data },
                    "0x1f5416e37a1df1970221038411bb92b94d714123e37d63e60093ee2f16f7192f",
                    {
                        tracer: "prestateTracer",
                        disableStorage: false,
                        tracerConfig: { diffMode: true },
                    },
                ])
                .then(async (trace: any) => {
                    for (const step of Object.keys(trace.post)) {
                        if (trace.post[step].storage) {
                            console.log("step ", step, trace.post[step].storage)
                        }
                        // console.log("step ", step, trace.post[step])
                    }
                    console.log("\n\nprestateTracer ", hash, trace)
                }).catch((error: any) => {
                    console.log("\n\nprestateTracer error", hash, error)
                })
        }
        // })
    } catch (error) {
        console.log(error);
    }
}

main()