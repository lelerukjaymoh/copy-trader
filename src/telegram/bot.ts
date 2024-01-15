import { Telegraf } from "telegraf";
import { Messages } from "./messages";
import { exec } from "child_process"
import { AUTHORIZED_USERS, TG_ID, UNISWAP_V2_ROUTER_ADDRESS, config } from "../utils/constants";
import { verifyInput } from "../utils/verify";
import { helper } from "../utils/helper";
import { MaxInt256, ZeroAddress, parseEther } from "ethers";
import { Account } from "../utils/account";
import { router } from "../swap/router";
import { dpOps } from "../db/operations";

export class TGBot extends Messages {
    bot: Telegraf;
    account: Account

    constructor() {
        super()
        this.bot = new Telegraf(process.env.TG_BOT_TOKEN!);

        this.account = new Account()
    }

    startBot = async () => {
        // Start the bot
        await this.bot.launch().catch((error: any) => {
            console.log("Error starting bot ", error)
        })

    }

    operate = async () => {

        try {
            // Reply when a user sends start to the bot
            this.bot.start((ctx: { replyWithHTML: (arg0: string) => void; }) => {
                console.log("Started bot")
                ctx.replyWithHTML(this.startMessage())
            })

            this.bot.help((ctx: { replyWithHTML: (arg0: string) => void; }) => {
                ctx.replyWithHTML(this.helpMessage())
            })

            this.bot.command("restart", (ctx: { replyWithHTML: (arg0: string) => void; }) => {
                console.log("Restarting bot")

                exec("pm2 restart copy", (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return ctx.replyWithHTML(error.message);
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return ctx.replyWithHTML(stderr);
                    }
                    console.log(`stdout: ${stdout}`);
                });
            })

            this.bot.on("text", async (ctx) => {
                try {

                    console.log("Processing command ", ctx.message?.text)

                    ctx.replyWithHTML("Processing...")

                    let user = ctx.message.from.id.toString()

                    // Check that the user is authorized to make this request
                    if (AUTHORIZED_USERS.includes(user)) {

                        const text = ctx.message?.text ? ctx.message?.text : ctx.update.message.text || "";
                        const inputData: any = verifyInput.checkTGInput(text)

                        if (inputData.error) {
                            return ctx.replyWithHTML(inputData.reason)
                        }

                        console.log("Input Data ", inputData)

                        if (inputData.action == "approve") {
                            const allowance = await helper.tokenAllowance(inputData.token, UNISWAP_V2_ROUTER_ADDRESS, this.account.accountAddress)

                            if (!allowance.success) {
                                return ctx.replyWithHTML(this.errorFetchingTokenAllowance(inputData.token, allowance.data))
                            }

                            const tokenAllowance = allowance.data

                            if (tokenAllowance > 0) {
                                return ctx.replyWithHTML(this.tokenAlreadyApproved(inputData.token))
                            }

                            const txResponse = await helper.approveToken(inputData.token, UNISWAP_V2_ROUTER_ADDRESS, MaxInt256)

                            ctx.replyWithHTML("Transaction successfully submitted. Waiting for confirmation")

                            console.log("Tx Response ", txResponse)

                            const tx = await txResponse.wait()

                            if (tx.status == 1) {
                                await ctx.replyWithHTML(this.successfulApproval(inputData.token, tx.hash), { disable_web_page_preview: true })
                            } else {
                                await ctx.replyWithHTML(this.unSuccessfulApproval(inputData.token), { disable_web_page_preview: true })
                            }

                        } else if (inputData.action == "buy") {
                            const amountIn = parseEther(inputData.amount)

                            const txnReceipt = await router.buy(inputData.token, amountIn, inputData.slippage)

                            if (txnReceipt && txnReceipt.status! == 1) {
                                console.log("Transaction Receipt: ", txnReceipt, inputData.token);

                                await dpOps.saveTrade(inputData.token, amountIn, txnReceipt.hash, ZeroAddress, "manual")

                                await helper.approveToken(inputData.token, UNISWAP_V2_ROUTER_ADDRESS, MaxInt256)
                                    .catch(error => console.log("Error approving token: ", error))

                                await telegramBot.sendNotification(
                                    TG_ID,
                                    this.successfulTransactionMessage("BUY", inputData.token, txnReceipt.hash)
                                ).catch(error => console.log("Error sending notification: ", error))
                            }
                        } else if (inputData.action == "sell") {
                            // When selling the inputData.amount is the percentage of tokens that should be sold. 100% means all tokens should be sold
                            const txnReceipt = await router.sell(inputData.token, inputData.amount, inputData.slippage)

                            if (txnReceipt && txnReceipt.status! == 1) {
                                console.log("Transaction Receipt: ", txnReceipt, inputData.token);

                                await telegramBot.sendNotification(
                                    TG_ID,
                                    this.successfulTransactionMessage("SELL", inputData.token, txnReceipt.hash)
                                ).catch(error => console.log("Error sending notification: ", error))
                            }
                        }

                    } else {
                        ctx.replyWithHTML(this.unAuthorizedAccessMessage())
                    }
                } catch (error) {
                    console.log("Error processing command ", error)
                }
            })

        } catch (error) {
            console.error("\n Error operating bot ", error)
        }
    }

    sendNotification = async (chatId: string, message: string) => {
        try {
            this.bot.telegram.sendMessage(chatId, message, {
                parse_mode: "HTML",
                disable_web_page_preview: true,
            })
        } catch (error) {
            console.log("Error sending notification to TG ", error)
        }
    }


}

export const telegramBot = new TGBot()
telegramBot.startBot()