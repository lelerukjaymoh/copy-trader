import mongoose from "mongoose";

const connectDB = async () => {
    await mongoose
        .connect(process.env.DB_URI!)
        .then(() => console.log("Successfully connected to db"))
        .catch((error: any) => {
            console.log("Error connecting to db: ", error)
            process.exit(1)
        })
}

connectDB()