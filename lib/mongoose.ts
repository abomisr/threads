import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async () => {
    mongoose.set("strictQuery",true);

    if(!process.env.MONGODB_URL) return console.log("MONGODB URL not found.")

    if(isConnected) return console.log("Already Connected to Mongodb");

    try{
        await mongoose.connect(process.env.MONGODB_URL)

        isConnected = true;
        console.log("Connected to Mongodb")
    }catch(err){
        console.log("DB connection error: ", err)
    }
};
