import express, { response } from 'express'
import { request } from 'http';
const app = express()
import * as path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000

app.use(express.json())
app.use(express.urlencoded({extended: true }))
app.use(express.static('public'))
app.get('/home', (request, response) => {
    response.sendFile(__dirname+'/index.html')
})


app.get('/comics/:id', (request, response) => {
    const comicsId = request.params.id
    console.log(comicsId)
    response.sendFile(__dirname+'/comics/'+comicsId+'.html')
})

app.get('/comics', (request, response) => {
    response.sendFile(__dirname+'/comics.html')
})

app.get('/solo-leveling', (request, response) => {
    response.sendFile(__dirname+'/solo-leveling.html')
})

app.post('/personal-reviews', (request,response) => {
    // console.log(request)
    response.send(`Thank you for your review ${request.body.name}!`)
})

app.listen(PORT, () => {
    console.log(`👋 Started server on port ${PORT}`)
})