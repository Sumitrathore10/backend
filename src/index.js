import db_connect from "./db/database.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
})

db_connect()