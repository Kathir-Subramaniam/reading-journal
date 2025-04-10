import express, { response } from 'express'
import { request } from 'http';
const app = express()
app.set('view engine', 'ejs')
import * as path from 'path'
import { fileURLToPath } from 'url'
import { connectDB } from './db.js'
import { Comic } from './model/comics.js'
import { User } from './model/users.js';

import { title } from 'process';
import { error } from 'console';
// import { comicsCollection } from './db.js';
// import data from './views/comics/comicsdbold.json' with {type: "json"}

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 4000
const database = connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/home', async (request, response) => {
    const user = await User.find({}).exec()
    console.log(user[0].categories)
    response.render('index', {data:user[0].categories, title: "KD's Logbook" })
})

app.get('/comics/:id/edit', async (request, response) => {
    const comicsId = request.params.id
    console.log(comicsId)
    const comic = await User.findOne({ slug: comicsId })
    response.render('comics/edit-comic', { comic: comic, title: comic.title, heading: "KD's Reading Journal" })
})

app.get('/comics/:id/delete', async (request, response) => {
    try {
        const comicsId = request.params.id
        await User.findOneAndDelete({ slug: comicsId })
        response.redirect(`/comics`)
    } catch (error) {
        console.error(error)
        response.send('Error: The comic could not be deleted.')
    }
})

app.get('/comics/new-comic', (request, response) => {
    response.render('comics/new-comic', { heading: "KD's Reading Journal", title: "New User" })
})

app.get('/categories/:categoryId/:id', async (request, response) => {
    const categoryId = request.params.categoryId
    const comicsId = request.params.id
    console.log(categoryId)
    console.log(comicsId)
    const user = await User.findOne({ 'categories.categoryPage.slug': comicsId }).exec()
    console.log("This is the right one" + user.categories[0].categoryPage.bookImg)



    if (!user) {
        return response.render('404', { error: "I Haven't Read This Comic Yet..." })
    }

    else {
        response.render('comics/comic-template', {
            heading: "KD's Reading Journal",
            title: user.categories[0].categoryPage.bookTitle,
            bookImg: user.categories[0].categoryPage.bookImg,
            description: user.categories[0].categoryPage.bookDescription,
            chapters: user.categories[0].categoryPage.chapters,
            status: user.categories[0].categoryPage.status,
            type: user.categories[0].categoryPage.type,
            slug: user.categories[0].categoryPage.slug
        })
    }

})

app.post('/comics/new-comic', (request, response) => {

    console.log(request.body.bookDescription)
    const comic = new Comic({
        bookImg: request.body.bookImg,
        bookTitle: request.body.bookTitle,
        bookDescription: request.body.bookDescription,
        status: request.body.status,
        chapters: request.body.chapters,
        type: request.body.type,
        slug: request.body.slug
    })
    console.log(comic)
    comic.save()
        .then(() => response.redirect('/comics'))
        .catch((error) => response.send('Error: The Comic could not be created' + error))
})

app.post('/categories/:categoryId/:id/edit', async (request, response) => {
    try {
        const categoryId = request.params.categoryId
        const comicsId = request.params.id
        const comic = await Comic.findOneAndUpdate({ slug: comicsId }, request.body, { new: true })
        console.log(comic)
        response.redirect(`/${categoryId}/${comic.slug}`)
    } catch (error) {
        console.error(error)
        response.send('Error: The Comic could not be created.')
    }
})

app.get('/categories/:categoryId', async (request, response) => {
    
    const categoryId = request.params.categoryId
    console.log(categoryId)

    const user = await User.findOne({'categories.categorySlug': categoryId}).exec()
    let categoryIndex
    for (var i = 0; i < user.categories.length; i++) {
        // console.log(user.categories[i].categorySlug)
        if (user.categories[i].categorySlug == categoryId){
            categoryIndex = i
        }
    }
    const correctCategory = user.categories[categoryIndex]
    console.log(correctCategory)
    console.log(correctCategory.categoryPage)
    response.render('comics', { categorySlug: correctCategory.categorySlug, data: correctCategory.categoryPage, title: "KD's Reading Journal" })

})

app.post('/personal-reviews', (request, response) => {
    // console.log(request)
    const userName = data.user
    const userReview = data.review
    response.send(`Thank you for your review ${request.body.name}!<br/>List of past reviews -<br/> ${userName}: ${userReview}`)
})

app.all('*', (request, response) => {
    if (request.accepts('html')) {
        response.render('404', { error: "This Page Is Not Found" })
    }
    else if (request.accepts('json')) {
        response.status(404).json({ error: "404 Not Found" })
    }
    else {
        response.status(404).type('txt').send("404 Not Found")
    }
})

app.listen(PORT, () => {
    console.log(`👋 Started server on port ${PORT}`)
})