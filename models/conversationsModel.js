import mongoose from 'mongoose';

const conversationsSchema = new mongoose.Schema({
    participants:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Messege"
    }],

    messages:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Messege"
    }],
  
},{timestamps:true})
export const Conversation = mongoose.model("Conversation",conversationsSchema);