import { Schema, model } from "mongoose";
import { ITrade } from "../utils/types";


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
    }
}, {
    timestamps: true
})


export const Trade = model<ITrade>("Trade", TradeSchema);