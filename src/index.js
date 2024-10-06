import db_connect from "./db/database.js";
import dotenv from "dotenv";

dotenv.config({
    path: "./env"
})

db_connect()
.then(()=>{
    const PORT = process.env.PORT || 8000
    app.listen(PORT,()=>{
        console.log(`server is running on http://localhost:${PORT}`)
    })
})
.catch((err)=>{
    console.log('MONGODB FAILER TO CONNECT',err)
})