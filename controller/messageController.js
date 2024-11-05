import { ChatForum } from "../models/chatFormModel.js";
import { Conversation } from "../models/conversationsModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/Socket.js";

export const sendMessage = async (req,res) => {
    try {
        const senderId = req.user.userId;
        const receiverId = req.params.id;
        const {message} = req.body;
console.log(senderId,receiverId)
        let gotConversation = await Conversation.findOne({
            participants:{$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants:[senderId, receiverId]
            })
        };
        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        });
        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        };
        

        await Promise.all([gotConversation.save(), newMessage.save()]);
         
        // SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        console.log(receiverSocketId);
        
        if(receiverSocketId){
            console.log("mssging ji ",newMessage)
            io.to(receiverSocketId).emit("newPrivateMessage", newMessage);
        }

        // if(receiverSocketId){
        //     // io.to(receiverSocketId).emit("newMessage", newMessage);
        // }


        // socket.on('sendPrivateMessage', () => {
        //     io.to(receiverId).emit('newPrivateMessage', { senderId, message });
        // });
        return res.status(201).json({
            newMessage
        })
    } catch (error) {
        console.log(error);
    }
}

export const getMessage = async (req, res) => {
    console.log("in finding message")
    try {
        const receiverId = req.params.id;
        const senderId = req.user.userId; // Assuming senderId is stored in req.user.userId
        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, receiverId] }
        }).populate("messages"); 

        if (!conversation) {
            return res.status(200).json({ message: "Conversation not found" ,
                conversation:[],
                success: false
            });
        }

        return res.status(200).json({messages:conversation.messages,success:true}); // Directly returning the messages array
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to retrieve messages" });
    }
};

export const sendMessageToChatForum = async (req, res) => {
    try {
        const { content } = req.body;
        const senderId = req.params.id;

        // Update the forum with the new message and retrieve the updated document
        let chatForum = await ChatForum.findOneAndUpdate(
            {}, // Find the first (and only) forum
            { $push: { messages: { senderId, content } } }, // Add the message
            { new: true, upsert: true } // Return updated document, create if it doesn’t exist
        ).populate({
            path: 'messages.senderId',
        });

        // Get the latest message (the last item in the messages array)
        const latestMessage = chatForum.messages[chatForum.messages.length - 1];

        // Emit the latest message to all users in the openForum room
        io.to('openForum').emit('openChatMessage', latestMessage);
            // console.log(latestMessage);
        // Respond with success and the latest message
        res.status(201).json({ message: "Message sent successfully", newMsg:latestMessage });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send message" });
    }
};



export const getChatForumMessages = async (req, res) => {
    console.log("called open form")
    try {
        // Find the single chat forum and populate sender details if needed
        const chatForum = await ChatForum.findOne().populate({
            path: 'messages.senderId',
            // select: 'name' // Customize as needed to show sender information
        });
            // console.log(chatForum)
        if (!chatForum) {
            return res.status(200).json({ message: "Chat forum not found" });
        }

        res.status(200).json({ openChatmessages: chatForum });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to retrieve messages" });
    }
};
