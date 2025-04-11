import express, { response } from 'express'
import { request } from 'http';
const app = express()
app.set('view engine', 'ejs')
import * as path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose';
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
    response.render('index', { data: user[0].categories, title: "KD's Logbook" })
})

app.get('/categories/:categoryId/:id/edit', async (request, response) => {
    const categoryId = request.params.categoryId
    const itemId = request.params.id
    console.log(itemId)
    const user = await User.findOne({ 'categories.categoryPage.slug': itemId }).exec()

    let categoryIndex
    for (var i = 0; i < user.categories.length; i++) {
        if (user.categories[i].categorySlug == categoryId) {
            categoryIndex = i
        }
    }
    const correctCategory = user.categories[categoryIndex]

    let itemIndex
    for (var i = 0; i < correctCategory.categoryPage.length; i++) {
        if (correctCategory.categoryPage[i].slug == itemId) {
            itemIndex = i
        }
    }
    const correctItem = correctCategory.categoryPage[itemIndex]

    response.render('comics/edit-comic', { categorySlug: correctCategory.categorySlug, comic: correctItem, title: correctItem.title, heading: "KD's Reading Journal" })
})

app.get('/categories/:categoryId/:id/delete', async (request, response) => {
    try {
        const categoryId = request.params.categoryId
        const itemId = request.params.id

        const user = await User.findOne({ 'categories.categoryPage.slug': itemId }).exec()
        
        let categoryIndex
        for (var i = 0; i < user.categories.length; i++) {
            if (user.categories[i].categorySlug == categoryId) {
                categoryIndex = i
            }
        }
        const correctCategory = user.categories[categoryIndex]

        let itemIndex
        for (var i = 0; i < correctCategory.categoryPage.length; i++) {
            if (correctCategory.categoryPage[i].slug == itemId) {
                itemIndex = i
            }
        }
        const correctItem = correctCategory.categoryPage[itemIndex]

        console.log("correct")
        await User.updateOne({'categories.categoryPage.slug': itemId}, 
            {
                $pull: {
                    // 'categories.$[categoryId]': {
                    //     'categoryPage.$[itemId]': {
                    //         $elemMatch: {slug: itemId}
                    //     }
                    // }
                    'categories.$.categoryPage': {
                        slug: itemId
                    }
                }
            }
            // {
            //     arrayFilters: [{'categoryId': categoryId},{'itemId': itemIndex}]
                
            // }
        )
        // await User.findOneAndDelete({'categories.categoryPage.slug': itemId}, {'categories.$[categoryIndex].categoryPage.$[itemIndex]': correctItem}, {arrayFilters: [{'categoryIndex.categorySlug': categoryId},{'itemIndex.slug': itemId}]})

        // await User.findOneAndDelete({ slug: comicsId })
        response.redirect(`/categories/${categoryId}`)
    } catch (error) {
        console.error(error)
        response.send('Error: The comic could not be deleted.')
    }
})

app.get('/categories/:categoryId/new-item', (request, response) => {
    const categoryId = request.params.categoryId
    response.render('comics/new-comic', { categorySlug: categoryId, heading: "KD's Reading Journal", title: "New Item" })
})

app.get('/categories/:categoryId/:id', async (request, response) => {
    const categoryId = request.params.categoryId
    const itemId = request.params.id
    const user = await User.findOne({ 'categories.categoryPage.slug': itemId }).exec()

    if (!user) {
        return response.render('404', { error: "I Haven't Read This Comic Yet..." })
    }

    else {

        let categoryIndex
        for (var i = 0; i < user.categories.length; i++) {
            if (user.categories[i].categorySlug == categoryId) {
                categoryIndex = i
            }
        }
        const correctCategory = user.categories[categoryIndex]

        let itemIndex
        for (var i = 0; i < correctCategory.categoryPage.length; i++) {
            if (correctCategory.categoryPage[i].slug == itemId) {
                itemIndex = i
            }
        }
        const correctItem = correctCategory.categoryPage[itemIndex]

        response.render('comics/comic-template', {
            categorySlug: correctCategory.categorySlug,
            heading: "KD's Reading Journal",
            title: correctItem.bookTitle,
            bookImg: correctItem.bookImg,
            description: correctItem.bookDescription,
            chapters: correctItem.chapters,
            status: correctItem.status,
            type: correctItem.type,
            slug: correctItem.slug
        })
    }

})

app.post('/categories/:categoryId/new-comic', async (request, response) => {

    const categoryId = request.params.categoryId

    const user = await User.findOne({ 'categories.categorySlug': categoryId }).exec()

    let categoryIndex
    for (var i = 0; i < user.categories.length; i++) {
        if (user.categories[i].categorySlug == categoryId) {
            categoryIndex = i
        }
    }
    const correctCategory = user.categories[categoryIndex]

    correctCategory.categoryPage.push({
        bookImg: request.body.bookImg,
        bookTitle: request.body.bookTitle,
        bookDescription: request.body.bookDescription,
        status: request.body.status,
        chapters: request.body.chapters,
        type: request.body.type,
        slug: request.body.slug
    })
    console.log(correctCategory)
    const userUpdate = await User.findOneAndUpdate({ 'categories.categorySlug': categoryId }, { $set: { correctCategory } })

    // console.log(request.body.bookDescription)
    // const user = new User({
    //     bookImg: request.body.bookImg,
    //     bookTitle: request.body.bookTitle,
    //     bookDescription: request.body.bookDescription,
    //     status: request.body.status,
    //     chapters: request.body.chapters,
    //     type: request.body.type,
    //     slug: request.body.slug
    // })
    console.log(user)
    user.save()
        .then(() => response.redirect(`/categories/${categoryId}`))
        .catch((error) => response.send('Error: The Comic could not be created' + error))
})

app.post('/categories/:categoryId/:id/edit', async (request, response) => {
    try {

        const categoryId = request.params.categoryId
        const itemId = request.params.id

        const user = await User.findOne({ 'categories.categoryPage.slug': itemId }).exec()

        let categoryIndex
        for (var i = 0; i < user.categories.length; i++) {
            if (user.categories[i].categorySlug == categoryId) {
                categoryIndex = i
            }
        }
        const correctCategory = user.categories[categoryIndex]

        let itemIndex
        for (var i = 0; i < correctCategory.categoryPage.length; i++) {
            if (correctCategory.categoryPage[i].slug == itemId) {
                itemIndex = i
            }
        }
        const correctItem = correctCategory.categoryPage[itemIndex]

        correctItem.bookImg = request.body.bookImg,
        correctItem.bookTitle = request.body.bookTitle,
        correctItem.bookDescription = request.body.bookDescription,
        correctItem.status = request.body.status,
        correctItem.chapters = request.body.chapters,
        correctItem.type = request.body.type,
        correctItem.slug = request.body.slug
        console.log(correctItem)
        
        const userUpdate = await User.findOneAndUpdate({'categories.categoryPage.slug': itemId}, {$set:{'categories.$[categoryIndex].categoryPage.$[itemIndex]': correctItem}}, {arrayFilters: [{'categoryIndex.categorySlug': categoryId},{'itemIndex.slug': itemId}]})

        response.redirect(`/categories/${categoryId}/${correctItem.slug}`)
    } catch (error) {
        console.error(error)
        response.send('Error: The Comic could not be created.')
    }
})

app.get('/categories/:categoryId', async (request, response) => {

    const categoryId = request.params.categoryId
    console.log(categoryId)

    const user = await User.findOne({ 'categories.categorySlug': categoryId }).exec()
    let categoryIndex
    for (var i = 0; i < user.categories.length; i++) {
        // console.log(user.categories[i].categorySlug)
        if (user.categories[i].categorySlug == categoryId) {
            categoryIndex = i
        }
    }
    const correctCategory = user.categories[categoryIndex]
    // console.log(correctCategory)
    // console.log(correctCategory.categoryPage)
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