import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const MONGODB_URI = "mongodb+srv://swarajcn774:k8J0SPFmysg88Cvc@cluster0.1dmz2.mongodb.net/mvd_portal";
        
        // Add connection options
        const conn = await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // 10 seconds timeout
            socketTimeoutMS: 45000, // 45 seconds socket timeout
            family: 4 // Use IPv4
        });
        
        console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
        return true;
    } catch (error) {
        console.error(`❌ MongoDB Error: ${error.message}`);
        console.log('⚠️ Running without database...');
        return false; // Don't exit, just return false
    }
};

export default connectDB;