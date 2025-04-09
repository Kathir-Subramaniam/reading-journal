import {config} from 'dotenv'
import mongoose from "mongoose";
import { error } from "console";

config()
const uri = process.env.DB_URI 
//const uri = "mongodb+srv://"+DB_USERNAME+":"+DB_PASSWORD+"@gary.j6f22.mongodb.net/Logbook?retryWrites=true&w=majority"

export const connectDB = async() => {
    try {
        await mongoose.connect(uri, {})
        console.log('💽 Database connected')
    } catch (error) {
        console.error("Error connecting to database:" , error)
    }
}