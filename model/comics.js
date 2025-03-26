import mongoose from "mongoose";
import { type } from "os";
const Schema = mongoose.Schema

const comicSchema = new Schema({
  bookImg: {
    type:String,
    required:true
  },
  bookTitle:{
    type:String,
    required:true,
  },
  bookDescription:{
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
  },
  chapters: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true
  },
})

export const Comic = mongoose.model('Comic', comicSchema, 'Comics')
// module.exports = Comic