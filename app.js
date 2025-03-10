import express, { response } from 'express'
const app = express()
import * as path from 'path'
import { fileURLToPath } from 'url'
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PORT = 3000

app.use(express.static())
app.get('/home', (request, response) => {
    response.sendFile(__dirname+'/home.html')
})
app.get('/comics', (request, response) => {
    response.sendFile(__dirname+'/comics.html')
})

app.get('/comics/:id', (request, respond) => {

})

app.get('/sololeveling', (request, response) => {
    response.sendFile(__dirname+'/sololeveling.html')
})

app.listen(PORT, () => {
    console.log(`👋 Started server on port ${PORT}`)
})