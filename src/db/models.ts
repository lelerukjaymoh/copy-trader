import { Schema, model } from "mongoose";
import { ITrade } from "../utils/types";

enum TradeType {
    COPY = "copy",
    MANUAL = "manual"
}


const TradeSchema = new Schema<ITrade>({
    token: {
        type: String,
        required: true
    },
    amount: {
        type: BigInt,
        required: true
    },
    txHash: {
        type: String,
        unique: true,
        required: true
    },
    target: {
        type: String,
        required: true
    },
    tradeType: {
        type: Schema.Types.String,
        enum: {
            values: Object.values(TradeType),
            message: `tradeType can only be: ${Object.values(TradeType).join(",")}`,
        }
    }
}, {
    timestamps: true
})


export const Trade = model<ITrade>("Trade", TradeSchema);