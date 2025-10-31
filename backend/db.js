require('dotenv').config();
const mongoose = require('mongoose');
const mongoURI = process.env.MONGO_URI;

const connectToMongo = async() => {
  try{
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
  }catch(error){
    console.error('MongoDB connection failed:', error);
    process.exit(1);
  }
}

module.exports = connectToMongo;