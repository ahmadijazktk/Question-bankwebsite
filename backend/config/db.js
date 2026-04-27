import mongoose from 'mongoose';

/**
 * Connect to MongoDB
 */
export const connectDB = async () => {
  try {
    // Default to local MongoDB if MONGO_URI is not set
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/studybloom';
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📦 Database: ${conn.connection.name}`);
    return conn;
  } catch (error) {
    console.error(`❌ MongoDB connection error: ${error.message}`);
    // Do not exit process, let the server keep running
  }
};

