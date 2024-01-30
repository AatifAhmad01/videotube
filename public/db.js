import mongoose from "mongoose";
import { DB_NAME } from "../src/contsants.js";

export default async function ConnectDB() {
    try {
        console.log("Connecting Db");
        const connection = await mongoose.connect(`${process.env.MONGO_URI}/${DB_NAME}`)

        console.log(`DB Connected to ${connection.connection.host}`)
    }
    catch (error) {
        console.log(error)
    }
}
