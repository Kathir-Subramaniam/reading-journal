import express, { response } from 'express'
import { request } from 'http';
const app = express()
app.set('view engine', 'ejs')
import * as path from 'path'
import { fileURLToPath } from 'url'
import data from './views/comics/comicsdb.json' with {type: "json"}
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use(express.static('public'))

app.get('/home', (request, response) => {
    // response.sendFile(__dirname+'/index.html')
    response.render('index')
})


app.get('/comics/:id', (request, response) => {
    const comicsId = request.params.id
    console.log(comicsId)
    console.log(data.comic);

    console.log(data.comic[comicsId].bookTitle);

    
    response.render('comics/comic-template', {heading: data.comic.pageTitle, 
        title: data.comic[comicsId].bookTitle, 
        bookImg: data.comic[comicsId].bookImg, 
        description: data.comic[comicsId].bookDescription,
        chapters: data.comic[comicsId].chapters,
        status: data.comic[comicsId].status,
        type: data.comic[comicsId].type
    })
})

app.get('/comics', (request, response) => {
    response.render('comics')
})

app.post('/personal-reviews', (request,response) => {
    // console.log(request)
    const userName = data.user
    const userReview = data.review
    response.send(`Thank you for your review ${request.body.name}!<br/>List of past reviews -<br/> ${userName}: ${userReview}`)
})

app.all('*', (request,response) => {
    if (request.accepts('html')) {
        response.render('404')
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