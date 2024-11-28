import express from 'express';
import authRoutes from './routes/auth.js';
import messageRoutes from './routes/message.js';
import { connectDB } from './lib/db.js';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser())
app.use("/api/auth",authRoutes);
app.use("/api/message",messageRoutes);


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
})