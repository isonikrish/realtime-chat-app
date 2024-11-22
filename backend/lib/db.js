import mongoose from 'mongoose';
export const connectDB = async() =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Mongodb connected successfully`);
    } catch (error) {
        console.log(`Mongodb connection error`);
    }
}