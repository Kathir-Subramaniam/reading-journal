import express, { response } from 'express'
import { request } from 'http';
const app = express()
app.set('view engine', 'ejs')
import * as path from 'path'
import { fileURLToPath } from 'url'
import {connectDB} from './db.js'
import {Comic} from './model/comics.js'

import { title } from 'process';
import { error } from 'console';
// import { comicsCollection } from './db.js';
// import data from './views/comics/comicsdbold.json' with {type: "json"}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 4000
const database = connectDB()

app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use(express.static('public'))

app.get('/home', (request, response) => {
    //console.log(data.home.pageTitle)
    response.render('index', {title: "KD's Logbook"})
})

app.get('/comics/:id',async (request, response) => {
    const comicsId = request.params.id
    console.log(comicsId)
    // console.log(data.comic);
    // console.log(data.comic[comicsId].bookTitle);
    
    //const comic = data.comic.data.find((comic) => comic.slug === comicsId)
    const comic = await Comic.findOne({slug : comicsId})
    console.log(comic)
    if (!comic){
        return response.render('404', {error: "I Haven't Read This Comic Yet..."})
    }
    
    if (comic.slug == "new-comic"){
        response.render('comics/new-comic', {heading: "KD's Reading Journal"})
    }
    
    else {
        response.render('comics/comic-template', {heading: "KD's Reading Journal", 
            title: comic.bookTitle, 
            bookImg: comic.bookImg, 
            description: comic.bookDescription,
            chapters: comic.chapters,
            status: comic.status,
            type: comic.type,
            slug: comic.slug
        })
    }
})

app.get('/comics', async (request, response) => {
    // console.log(data.comic.data);
    const comic = await Comic.find()
    // let comics = []
    // database.db().collection('Comics')
    // .find()
    // .forEach(comic => comics.push(comic))
    // .then(() => {
    //     response.status(200).render('comics', {data: comics, title: "KD's Reading Journal"})
    // })
    // .catch(() => {
    //     console.log("Couldn't fetch documents")
    // })

    console.log(comic)
    response.render('comics', {data: comic, title: "KD's Reading Journal"})
})

app.post('/personal-reviews', (request,response) => {
    // console.log(request)
    const userName = data.user
    const userReview = data.review
    response.send(`Thank you for your review ${request.body.name}!<br/>List of past reviews -<br/> ${userName}: ${userReview}`)
})

app.all('*', (request,response) => {
    if (request.accepts('html')) {
        response.render('404', {error: "This Page Is Not Found"})
    }
    else if (request.accepts('json')) {
        response.status(404).json({error: "404 Not Found"})
    }
    else {
        response.status(404).type('txt').send("404 Not Found")
    }
})

app.listen(PORT, () => {
    console.log(`👋 Started server on port ${PORT}`)
})