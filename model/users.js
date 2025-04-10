import mongoose from "mongoose";
import { type } from "os";
const Schema = mongoose.Schema

const contentSchema = new Schema({
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

const categorySchema = new Schema({
    categoryTitle: {
        type: String,
        required: true
    },
    categoryImg: {
        type: String,
        required: true
    },categorySlug: {
        type: String,
        required: true
    },categoryPageTitle: {
        type: String,
        required: true
    },categoryPage: [contentSchema],
})

const userSchema = new Schema({
    userName: {
        type: String, 
        required: true
    },
    pageTitle: {
        type: String,
        required: true
    },
    categories: [categorySchema],
})

export const User = mongoose.model('User', userSchema, 'Users')