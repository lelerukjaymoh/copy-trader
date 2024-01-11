import { Telegraf } from "telegraf";
import { Messages } from "./messages";
import { exec } from "child_process"
import { AUTHORIZED_USERS, UNISWAP_V2_ROUTER_ADDRESS, config } from "../utils/constants";
import { verifyInput } from "../utils/verify";
import { helper } from "../utils/helper";
import { TGRequestInput, TGRequestInputError } from "../utils/types";
import { MaxInt256 } from "ethers";

export class TGBot extends Messages {
    bot: Telegraf;

    constructor() {
        super()
        this.bot = new Telegraf(process.env.BOT_TOKEN!);

        // Start the bot
        this.bot.launch();
    }

    operate = async () => {
        try {
            // Reply when a user sends start to the bot
            this.bot.start((ctx: { reply: (arg0: string) => void; }) => {
                ctx.reply(this.startMessage())
            })

            this.bot.help((ctx: { reply: (arg0: string) => void; }) => {
                ctx.reply(this.helpMessage())
            })

            this.bot.command("restart", (ctx: { reply: (arg0: string) => void; }) => {
                console.log("Restarting bot")

                exec("pm2 restart copy", (error, stdout, stderr) => {
                    if (error) {
                        console.log(`error: ${error.message}`);
                        return ctx.reply(error.message);
                    }
                    if (stderr) {
                        console.log(`stderr: ${stderr}`);
                        return ctx.reply(stderr);
                    }
                    console.log(`stdout: ${stdout}`);
                });
            })

            this.bot.on("text", async (ctx) => {
                try {

                    ctx.reply("Processing. In case the bot hangs, click /restart to restart the bot")

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
                            if (await helper.tokenAllowance(inputData.token, UNISWAP_V2_ROUTER_ADDRESS, user) > 0) {
                                return ctx.replyWithHTML(this.tokenAlreadyApproved(inputData.token))
                            }

                            const txResponse = await helper.approveToken(inputData.token, UNISWAP_V2_ROUTER_ADDRESS, MaxInt256)

                            ctx.reply("Transaction successfully submitted. Waiting for confirmation")

                            const tx = await txResponse.wait()

                            if (tx.status == 1) {
                                await ctx.replyWithHTML(this.successfulApproval(inputData.token, tx.transactionHash), { disable_web_page_preview: true })
                            } else {
                                await ctx.replyWithHTML(this.unSuccessfulApproval(inputData.token), { disable_web_page_preview: true })
                            }

                        }
                        //  else if (inputData.action == "buy") {

                        //     await bu

                        //     console.log("\nInput Data ", inputData)

                        //     // Process the data to get all command parameters [chain, token, action, amount, ]
                        //     const data = await this.check.checkInputData(inputData)

                        //     console.log("\n\nChecked Data ", data)

                        //     if (data.error) {
                        //         console.log("Error processing user input ", data.reason)
                        //         // Send notification that there was an error processing the command input
                        //         await ctx.replyWithHTML(this.inputErrorMessage(data.reason))
                        //     } else {
                        //         this.swapper.swap(data, ctx)
                        //     }
                        // }

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