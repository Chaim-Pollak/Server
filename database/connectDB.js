import mongoose from "mongoose";

async function connectDB() {
  try {
    const uri = process.env.MONGO_URI;
    await mongoose.connect(uri);
    console.log("mongo is connected");
  } catch (error) {
    console.log(error);
  }
}

export default connectDB;
