import express from "express"; // Import express
import db_connect from "./db/database.js";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";

dotenv.config({
    path: "./env"
});

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true, // Corrected "Credential" to "credentials"
}));

app.use(express.json({
    limit: "20kb"
}));
app.use(express.urlencoded({
    extended: true,
    limit: "20kb"
}));
app.use(express.static("public"));
app.use(cookieParser());

// Routes import
import userRouter from "./routes/user.routes.js"; // Adjusted for default import

app.use("/api/v1/user", userRouter);

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    db_connect()
    console.log(`Server is running on http://localhost:${PORT}`);
})