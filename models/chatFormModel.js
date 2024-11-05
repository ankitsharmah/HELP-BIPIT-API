import mongoose from 'mongoose';

const chatForumSchema = new mongoose.Schema({
    messages: [{
        senderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, { timestamps: true });

export const ChatForum = mongoose.model("ChatForum", chatForumSchema);
