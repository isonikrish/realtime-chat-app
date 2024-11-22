import express from 'express';
import authRoutes from './routes/auth.js';
import { connectDB } from './lib/db.js';
import dotenv from 'dotenv';
dotenv.config();
const app = express();


app.use("/api/auth",authRoutes);


app.listen(process.env.PORT,()=>{
    console.log(`Server is running on port ${process.env.PORT}`);
    connectDB();
})