// import {Server} from "socket.io";
// import http from "http";
// import express from "express";

// const app = express();
// const server = http.createServer(app);
// const io = new Server(server, {
//     cors:{
//         origin:['http://localhost:5173'],
//         methods:['GET', 'POST'],
//     },
// });

// export const getReceiverSocketId = (receiverId) => {
//     return userSocketMap[receiverId];
// }

// const userSocketMap = {}; // {userId->socketId}


// io.on('connection', (socket)=>{
//     const userId = socket.handshake.query.userId
//     console.log("this is id ",userId);
//     if(userId !== undefined){
//         userSocketMap[userId] =socket.id  ;
//     } 

//     io.emit('getOnlineUsers',Object.keys(userSocketMap));

//     socket.on('disconnect', ()=>{
//         delete userSocketMap[userId];
//         io.emit('getOnlineUsers',Object.keys(userSocketMap));
//     })

// })


// export {app, io, server}

import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: ['http://localhost:5173',"https://3cnhfpsc-5173.inc1.devtunnels.ms"],
        methods: ['GET', 'POST'],
    },
});

const userSocketMap = {}; // Maps userId -> socketId for one-to-one chats
export const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
}
io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    console.log(userId);
    if (userId) {
        userSocketMap[userId] = socket.id;
        socket.join(userId); // Join one-to-one room
        socket.join('openForum'); // Join open forum room

        // Emit the updated online user list to all users
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    }

    // One-to-one chat handler
    // socket.on('sendPrivateMessage', ({ receiverId, message }) => {
    //     io.to(receiverId).emit('newPrivateMessage', { senderId: userId, message });
    // });
// Backend code (Socket.IO event handler)
// socket.on('sendPrivateMessage', ({ receiverId, message, senderId }) => {
//     io.to(receiverId).emit('newPrivateMessage', { senderId, message });
// });

    // Open chat handler
    // socket.on('sendOpenForumMessage', (message) => {
    //     console.log(message)
    //     io.to('openForum').emit('openChatMessage', { senderId: userId, message });
    // });

    // Handle disconnection
    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };
