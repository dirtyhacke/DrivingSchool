import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const MONGODB_URI = "mongodb+srv://swarajcn774:k8J0SPFmysg88Cvc@cluster0.1dmz2.mongodb.net/mvd_portal";
        const conn = await mongoose.connect(MONGODB_URI);
        console.log(`📦 MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1); // Exit with failure
    }
};

export default connectDB;