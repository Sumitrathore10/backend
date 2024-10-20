import { Router } from "express";
import {loginUser, logoutUser, registerUser} from "../controllers/user.controller.js"; 
import {upload} from "../middlewares/multer.middlewares.js"
import { verifyAuth } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/register").post(
    upload.fields([
        {
            name :"avatar",
            maxCount: 1
        },
        {
            name: "coverimage",
            maxCount: 1
        }
    ]),
    registerUser
);

router.route("/login").post(loginUser)

// secured route

router.route("/logout").post(verifyAuth,logoutUser)

export default router;

