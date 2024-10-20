import { User } from "../models/user.model";
import { apiError } from "../utils/apiError";
import asynchandler from "../utils/asynchandler";
import { jwt} from "jsonwebtoken";


export const verifyAuth = asynchandler(async (req,res,next)=>{
   try {
    const token = req.cookie?.accesstoken || req.header("Authorization")?.replace("Bearer ","")
    if(!token){
      throw new apiError(401,"Unauthorized request")
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
    const user = await User.findById(decodedToken?._id).select("-password -refreshtoken")
 
    if(!user){
      throw new apiError(401,"Invalid Access Token")
    }
    req.user = user
    next()
   } catch (error) {
    throw new apiError(401,error?.message || "Ivalid Access Token");
    
   }
})