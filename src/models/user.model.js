import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
        index:true,
    },
    email:{
        type:String,
        required:true,
        lowercase:true,
        unique:true,
        trim:true,
    },
    password:{
        type:String,
        required:[true,"Password is required !!!"],
        minlength:8,
        trim:true,
        index:true
    },
    avatar:{
        type:String,  //cloudnary url
        required:true
    },
    coverimage:{
        type:String, //cloudnary url
        
    },
    watchhistory:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Vedio"
        }
    ],
    refreshtoken:{
        type:String
    },

    
},{timestamps:true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")){
        return next()
    }else{
        this.password = bcrypt.hash(this.password,10)
        next()
    }

})

userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken = async function () {
    return jwt.sign({
        _id:this._id,
        email:this.email,
        username:this.username,
        fullname:this.fullname,

    },
process.env.ACCESS_TOKEN_SECRET,{
    expiresIn:process.env.ACCESS_TOKEN_EXPIRY,
})
}
userSchema.methods.generateRefreshToken = async function () {
    return jwt.sign({
        _id:this._id,
    },
process.env.REFRESH_TOKEN_SECRET,{
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
})
}




export const User = mongoose.model("User",userSchema)