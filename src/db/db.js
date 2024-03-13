import mongoose from "mongoose";
import { DB_NAME } from "../contsants.js";

export default async function ConnectDB() {
    try {
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)
        console.log(`DB Connected to ${connection.connection.host}`)
    }
    catch (error) {
        console.log(error)
        process.exit(1)
    }
}
