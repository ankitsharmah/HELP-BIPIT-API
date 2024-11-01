import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    itemType:{
        type:String,
        required:true
    },
    location:{
        type:String,
        required:true
    },
    specification:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    foundOn:{
        type:String,
        required:true
    },
    reportStatus:{
        type:String,
        enum:["LOST","FOUND","RESOLVED"]
    },
    reportedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    

},{timestamps:true})

export const Report=mongoose.model("Report",itemSchema);