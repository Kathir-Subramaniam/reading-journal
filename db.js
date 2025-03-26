import { MongoClient } from "mongodb";
import {config} from 'dotenv'
import mongoose from "mongoose";
import { error } from "console";

config()
const DB_PASSWORD = process.env.DB_PASSWORD

const uri = "mongodb+srv://kathirarunjunai:"+DB_PASSWORD+"@gary.j6f22.mongodb.net/Logbook"

export const connectDB = async() => {
    try {
        await mongoose.connect(uri, {})
        console.log('💽 Database connected')
    } catch (error) {
        console.error("Error connecting to database:" , error)
    }
}

// module.exports = connectDB
    // await mongoose.connect(uri)
    // .then(() => console.log('💽 Database connected'))
    // .catch(error => console.error(error))}


// const client = new MongoClient(uri)
// const database = client.db('Logbook')
// export const comicsCollection = database.collection('Comics');