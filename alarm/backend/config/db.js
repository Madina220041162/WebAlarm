const mongoose = require('mongoose');

async function connectDB(uri) {
  try {
    const mongoUri = uri || process.env.MONGODB_URI;
    if (!mongoUri) {
      console.error('MONGODB_URI not set in environment');
      return;
    }

    await mongoose.connect(mongoUri, {
      dbName: process.env.MONGODB_DB || undefined,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

module.exports = { connectDB, mongoose };
