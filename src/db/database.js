import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const db_connect = async() =>{
    try {
        const connect_instance = await mongoose.connect(`${process.env.MONGO_DB_URL}/${DB_NAME}`)
        console.log(`\n MONGO DB CONNECT || DB HOST : ${connect_instance.connection.host}`)
    } catch (error) {
        console.log("Failed to connect to database :",error);
        process.exit(1);
        
    }
}

export default db_connect