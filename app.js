import express, { response } from 'express'
import { request } from 'http';
const app = express()
app.set('view engine', 'ejs')
import * as path from 'path'
import { fileURLToPath } from 'url'
import data from './views/comics/comicsdb.json' with {type: "json"}
import { title } from 'process';
import { error } from 'console';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use(express.static('public'))

app.get('/home', (request, response) => {
    console.log(data.home.pageTitle)
    response.render('index', {title: data.home.pageTitle})
})

app.get('/comics/:id', (request, response) => {
    const comicsId = request.params.id
    console.log(comicsId)
    // console.log(data.comic);
    // console.log(data.comic[comicsId].bookTitle);
    
    const comic = data.comic.data.find((comic) => comic.slug === comicsId)
    //console.log(comic.slug)
    if (!comic){
        return response.render('404', {error: "I Haven't Read This Comic Yet..."})
    }
    
    response.render('comics/comic-template', {heading: data.comic.pageTitle, 
        title: comic.bookTitle, 
        bookImg: comic.bookImg, 
        description: comic.bookDescription,
        chapters: comic.chapters,
        status: comic.status,
        type: comic.type,
        slug: comic.slug
    })
})

app.get('/comics', (request, response) => {
    // console.log(data.comic.data);
    response.render('comics', {data: data.comic.data, title: data.comic.pageTitle})
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