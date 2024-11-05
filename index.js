import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDb from './config/database.js';
import userRouter from './routes/userRoutes.js';
import messageRoute from './routes/messageRoute.js';
import cors from 'cors';
import { app, server } from './socket/Socket.js';

dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // <-- Add this to parse cookies

const corsOption = {
    origin: ['http://localhost:5173',"https://3cnhfpsc-5173.inc1.devtunnels.ms"],
    credentials: true,
};
app.use(cors(corsOption));

app.use('/api/v1/user', userRouter);
app.use('/api/v1/messages', messageRoute);

app.get('/', (req, res) => {
    console.log('called');
    return res.status(200).json({ message: 'ok ji ' });
});

const port = process.env.PORT || 8080;
server.listen(port, () => {
    connectDb();
    console.log(`running on port ${port}`);
});
