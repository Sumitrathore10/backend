import { type } from "express/lib/response";
import mongoose from "mongoose";


const vedioSchema = new mongoose.Schema({
    vediofile:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    duration:{
        type:Number,
        required:true
    },
    views:{
        type:Number,
        default:0
    },
    ispublished:{
        type:Boolean,
        default:false
    },
},{timestamps:true})



export const Vedio = mongoose.model("Vedio",vedioSchema)