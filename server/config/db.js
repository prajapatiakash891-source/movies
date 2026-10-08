import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/aakashmovies';
    const conn = await mongoose.connect(mongoUri);
    console.log(`[MongoDB] Connected successfully to host: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`[MongoDB] Initial connection error: ${error.message}`);
    
    // Attempt fallback to memory server if local connection fails (development resiliency)
    try {
      console.log('[MongoDB] Attempting fallback with Mongo Memory Server...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const conn = await mongoose.connect(uri);
      console.log(`[MongoDB Memory Server] Connected successfully to in-memory instance: ${uri}`);
      return conn;
    } catch (memError) {
      console.error(`[MongoDB Memory Server] Fallback error: ${memError.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;
