import mongoose from 'mongoose';

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) {
    return true;
  }

  const mongoURI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/expense_tracker';

  try {
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 4000,
    });

    isConnected = true;
    console.log(`\x1b[32m✔ MongoDB Connected Successfully: ${conn.connection.host} [DB: ${conn.connection.name}]\x1b[0m`);
    return true;
  } catch (error) {
    isConnected = false;
    console.warn(`\x1b[33m⚠ MongoDB Connection Notice: Could not connect to ${mongoURI}\x1b[0m`);
    console.warn(`\x1b[33m  Reason: ${error.message}\x1b[0m`);
    console.warn(`\x1b[36mℹ Backend will operate in In-Memory Storage mode for quick testing until MongoDB is running.\x1b[0m`);
    return false;
  }
};

export const getDBStatus = () => {
  return isConnected && mongoose.connection.readyState === 1;
};

export default connectDB;
