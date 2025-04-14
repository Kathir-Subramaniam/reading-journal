import express, { response } from 'express'
import { request } from 'http';
const app = express()
app.set('view engine', 'ejs')
import * as path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose';
import { connectDB } from './db.js'
import { User } from './model/users.js';

import { title } from 'process';
import { error } from 'console';

const database = connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))

app.get('/', async (request, response) => {
    const user = await User.findOne({'userName': "Asterix"}).exec()
    console.log(user.categories)
    response.render('index', { data: user.categories, title: "KD's Logbook", sidebarData: user.categories })
})

app.get('/home', async (request, response) => {
    const user = await User.findOne({'userName': "Asterix"}).exec()
    console.log(user.categories)
    response.render('index', { data: user.categories, title: "KD's Logbook", sidebarData: user.categories })
})

app.get('/categories/new-category', async (request, response) => {
    const user = await User.findOne({ 'userName': "Asterix" }).exec()
    response.render('new-category', { heading: "KD's Logbook", title: "New Category", sidebarData: user.categories })
})

app.get('/categories/:categoryId/edit', async (request, response) => {
    const categoryId = request.params.categoryId
    console.log(categoryId)
    const user = await User.findOne({ 'userName': "Asterix" }).exec()
    console.log(user)
    let categoryIndex
    for (var i = 0; i < user.categories.length; i++) {
        if (user.categories[i].categorySlug == categoryId) {
            categoryIndex = i
        }
    }
    const correctCategory = user.categories[categoryIndex]

    response.render('edit-category', { categorySlug: correctCategory.categorySlug, comic: correctCategory, title: correctCategory.title, heading: "KD's Logbook", sidebarData: user.categories })
})

app.get('/categories/:categoryId/delete', async (request, response) => {
    try {
        const categoryId = request.params.categoryId

        const user = await User.findOne({ 'userName': "Asterix" }).exec()
        
        let categoryIndex
        for (var i = 0; i < user.categories.length; i++) {
            if (user.categories[i].categorySlug == categoryId) {
                categoryIndex = i
            }
        }
        const correctCategory = user.categories[categoryIndex]

        console.log("correct")
        await User.updateOne({'categories.categorySlug': categoryId}, 
            {
                $pull: {
                    'categories': {
                        categorySlug: categoryId
                    }
                }
            }
        )
        response.redirect(`/home`)
    } catch (error) {
        console.error(error)
        response.send('Error: The category could not be deleted.')
    }
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

    response.render('comics/edit-comic', { categorySlug: correctCategory.categorySlug, comic: correctItem, title: correctItem.title, heading: "KD's Reading Journal", sidebarData: user.categories })
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
                    'categories.$.categoryPage': {
                        slug: itemId
                    }
                }
            }
        )
        response.redirect(`/categories/${categoryId}`)
    } catch (error) {
        console.error(error)
        response.send('Error: The comic could not be deleted.')
    }
})

app.get('/categories/:categoryId/new-item', async (request, response) => {
    const categoryId = request.params.categoryId
    const user = await User.findOne({ 'userName': "Asterix" }).exec()
    response.render('comics/new-comic', { categorySlug: categoryId, heading: "KD's Reading Journal", title: "New Item", sidebarData: user.categories })
})

app.get('/categories/:categoryId/:id', async (request, response) => {
    const categoryId = request.params.categoryId
    const itemId = request.params.id
    const user = await User.findOne({ 'categories.categoryPage.slug': itemId }).exec()

    if (!user) {
        return response.render('404', { error: "I Haven't Read This Comic Yet...", sidebarData: user.categories })
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
            slug: correctItem.slug,
            sidebarData: user.categories
        })
    }

})

app.post('/categories/new-category', async (request, response) => {

    const user = await User.findOne({ userName: "Asterix" }).exec()

    user.categories.push({
        categoryTitle: request.body.categoryTitle,
        categoryImg: request.body.categoryImg,
        categorySlug: request.body.categorySlug,
        categoryPageTitle: request.body.categoryPageTitle,
        categoryPage: [] 
    })
    console.log(user.categories)
    const userUpdate = await User.findOneAndUpdate({ 'userName': "Asterix" }, { $set: { user } })
    console.log(user)
    user.save()
        .then(() => response.redirect(`/home`))
        .catch((error) => response.send('Error: The Category could not be created' + error))
})

app.post('/categories/:categoryId/edit', async (request, response) => {
    try {

        const categoryId = request.params.categoryId

        const user = await User.findOne({ 'categories.categorySlug': categoryId }).exec()

        let categoryIndex
        for (var i = 0; i < user.categories.length; i++) {
            if (user.categories[i].categorySlug == categoryId) {
                categoryIndex = i
            }
        }
        const correctCategory = user.categories[categoryIndex]

        correctCategory.categoryTitle = request.body.categoryTitle
        correctCategory.categoryImg = request.body.categoryImg
        correctCategory.categorySlug = request.body.categorySlug
        correctCategory.categoryPageTitle = request.body.categoryPageTitle

        console.log(correctCategory)
        
        const userUpdate = await User.findOneAndUpdate({'userName': "Asterix"}, {$set:{'categories.$[categoryIndex]': correctCategory}}, {arrayFilters: [{'categoryIndex.categorySlug': categoryId}]})

        response.redirect(`/categories/${correctCategory.categorySlug}`)
    } catch (error) {
        console.error(error)
        response.send('Error: The Comic could not be created.')
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
        if (user.categories[i].categorySlug == categoryId) {
            categoryIndex = i
        }
    }
    const correctCategory = user.categories[categoryIndex]
    response.render('comics', { categorySlug: correctCategory.categorySlug, data: correctCategory.categoryPage, title: correctCategory.categoryPageTitle, categoryTitle: correctCategory.categoryTitle, sidebarData: user.categories })

})

app.get('/wip', async (request, response) => {
    const user = await User.findOne({ 'userName': "Asterix" }).exec()
    response.render('wip', { sidebarData: user.categories })
})

app.post('/personal-reviews', (request, response) => {
    // response.send(`Thank you for your review ${request.body.name}! This feature is still Work In Progress! Come Back Later!`)
    response.redirect('wip')
})

app.all('*', async (request, response) => {
    const user = await User.findOne({ 'userName': "Asterix" }).exec()
    if (request.accepts('html')) {
        response.render('404', { error: "This Page Is Not Found", sidebarData: user.categories })
    }
    else if (request.accepts('json')) {
        response.status(404).json({ error: "404 Not Found" })
    }
    else {
        response.status(404).type('txt').send("404 Not Found")
    }
})

app.listen(process.env.PORT, () => {
    console.log(`👋 Started server on port ${process.env.PORT}`)
})