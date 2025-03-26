import mongoose from "mongoose";
import {config} from 'dotenv'
import { Comic } from "./model/comics.js";

config()
const DB_PASSWORD = process.env.DB_PASSWORD
const uri = "mongodb+srv://kathirarunjunai:"+DB_PASSWORD+"@gary.j6f22.mongodb.net/Logbook"

mongoose.connect(uri)

const comics = await Comic.findOne()
console.log(comics)