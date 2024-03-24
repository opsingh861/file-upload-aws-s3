import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
const config = {
    mongoURI: process.env.MONGO_URI
};

const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoURI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error(err.message);
    }
};

export default connectDB;