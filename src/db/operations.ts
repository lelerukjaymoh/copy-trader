import "./connect"
import { Trade } from "./models"

class DBOps {
    saveTrade = async (token: string, amount: BigInt, txHash: string, target: string) => {
        try {
            const trade = new Trade({
                token,
                amount,
                txHash,
                target
            })

            await trade.save()

            console.log("Trade saved successfully")

        } catch (error) {
            console.log("Error saving data: ", error)
        }
    }
}

export const dpOps = new DBOps()