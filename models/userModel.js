import mongoose ,{mongo} from "mongoose";


const userSchema = new mongoose.Schema({
    fullname:{
        type:String,
        required:true
    },
    nickName:{
        type:String,
        required:true
    },
    email:{
            type:String,
            required:true,
            unique:true
    },
    password:{
        type:String,
        required:true,
    },
    profilePic:{
        type:String,
    },
    gender:{
        type:String,
        enum:['male','female']
    },
    reports:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Report"
    },
    friends:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }]

},{timestamps:true});

export const User = mongoose.model('User',userSchema);