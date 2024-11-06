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
        origin: "*",
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


    socket.on('typing', ({ senderId, receiverId, typing }) => {
        // console.log("typing user")
        const receiverSocketId = userSocketMap[receiverId];
        if (receiverSocketId) {
            io.to(receiverSocketId).emit('typing', { senderId, typing });
        }
    });
 
    socket.on('disconnect', () => {
        delete userSocketMap[userId];
        io.emit('getOnlineUsers', Object.keys(userSocketMap));
    });
});

export { app, io, server };
