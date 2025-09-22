import mongoose from "mongoose";
import dotenv from "dotenv";


dotenv.config();

if (!process.env.DB_URI) {
    console.log(process.env.DB_URI);
    throw new Error("No DB URI , fix it!");
}

const dbConnect = async () => {
    try {
        const connect = await mongoose.connect(process.env.DB_URI);
        console.log(`Connected To DB : ${connect.connection.host} , ${connect.connection.name} `)
    } catch (error) {
        console.log("Error connecting to DB ", error.message);
        process.exit(1);
    }
}

export default dbConnect;
