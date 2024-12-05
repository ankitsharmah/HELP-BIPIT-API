// import express from 'express';
// import cookieParser from 'cookie-parser';
// import dotenv from 'dotenv';
// import connectDb from './config/database.js';
// import userRouter from './routes/userRoutes.js';
// import messageRoute from './routes/messageRoute.js';
// import cors from 'cors';
// import { createCanvas } from 'canvas';

// import { app, server } from './socket/Socket.js';

// dotenv.config();

// // Middleware to parse JSON bodies
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser()); // <-- Add this to parse cookies

// const corsOption = {
//     origin: ['http://localhost:5173',"https://3cnhfpsc-5173.inc1.devtunnels.ms"],
//     credentials: true,
// };
// app.use(cors(corsOption));

// app.use('/api/v1/user', userRouter);
// app.use('/api/v1/messages', messageRoute);

// app.get('/', (req, res) => {
//     console.log('called');
//     return res.status(200).json({ message: 'ok ji ' });
// });

// app.get('/api/avatar', (req, res) => {
//     const { name = 'Anonymous', size = 250 } = req.query;
  
//     // Generate initials based on name
//     const nameParts = name.split(' ').filter(Boolean);
//     let initials;
  
//     if (nameParts.length === 1) {
//       // If there's only one word, take the first two letters
//       initials = nameParts[0].substring(0, 2).toUpperCase();
//     } else {
//       // If there are two or more words, take the first letter of each
//       initials = nameParts.map(word => word[0].toUpperCase()).join('');
//     }
  
//     const canvasSize = parseInt(size);
//     const canvas = createCanvas(canvasSize, canvasSize);
//     const ctx = canvas.getContext('2d');
  
//     // Draw background with a random color
//     const colors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f1c40f'];
//     const bgColor = colors[Math.floor(Math.random() * colors.length)];
//     ctx.fillStyle = bgColor;
//     ctx.fillRect(0, 0, canvas.width, canvas.height);
  
//     // Draw initials text
//     ctx.fillStyle = '#FFFFFF';  // Text color
//     ctx.font = `${canvas.width / 2}px sans-serif`;
//     ctx.textAlign = 'center';
//     ctx.textBaseline = 'middle';
//     ctx.fillText(initials, canvas.width / 2, canvas.height / 2);
  
//     // Send the image as a response
//     res.setHeader('Content-Type', 'image/png');
//     canvas.createPNGStream().pipe(res);
//   });
  

// const port = process.env.PORT || 8080;
// server.listen(port, () => {
//     connectDb();
//     console.log(`running on port ${port}`);
// });


import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDb from './config/database.js';
import userRouter from './routes/userRoutes.js';
import messageRoute from './routes/messageRoute.js';
import lostAndfound from "./routes/lostAndfound.js"
import cors from 'cors';
import { createCanvas } from 'canvas';
import { app, server } from './socket/Socket.js';

dotenv.config();

// Middleware to parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // <-- Add this to parse cookies

// CORS configuration
const corsOptions = {
    origin: (origin, callback) => {
        // Allow all origins in development
        callback(null, true);
    },
    credentials: true, // This allows cookies and headers (like authorization) to be sent
};
app.use(cors(corsOptions));

// Routes
app.use('/api/v1/user', userRouter);
app.use('/api/v1/messagess', messageRoute);
app.use('/api/v1/reports',lostAndfound );

app.get('/', (req, res) => {
    console.log('called');
    return res.status(200).json({ message: 'ok ji ' });
});

// Avatar generation route
app.get('/api/avatar', (req, res) => {
    const { name = 'Anonymous', size = 250 } = req.query;
  
    // Generate initials based on name
    const nameParts = name.split(' ').filter(Boolean);
    let initials;
  
    if (nameParts.length === 1) {
      // If there's only one word, take the first two letters
      initials = nameParts[0].substring(0, 2).toUpperCase();
    } else {
      // If there are two or more words, take the first letter of each
      initials = nameParts.map(word => word[0].toUpperCase()).join('');
    }
  
    const canvasSize = parseInt(size);
    const canvas = createCanvas(canvasSize, canvasSize);
    const ctx = canvas.getContext('2d');
  
    // Draw background with a random color
    const colors = ['#3498db', '#e74c3c', '#2ecc71', '#9b59b6', '#f1c40f'];
    const bgColor = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  
    // Draw initials text
    ctx.fillStyle = '#FFFFFF';  // Text color
    ctx.font = `${canvas.width / 2}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, canvas.width / 2, canvas.height / 2);
  
    // Send the image as a response
    res.setHeader('Content-Type', 'image/png');
    canvas.createPNGStream().pipe(res);
  });

const port = process.env.PORT || 8080;
server.listen(port, () => {
    connectDb();
    console.log(`running on port ${port}`);
});
