const express = require('express')

const app = express()

let users = new Map();
let messages = new Map();

app.use(express.json())

app.use((req, res, next) => {
    console.log()
    console.log(`${req.url}`)
    next()
})

app.get('/', (req, res) => {
    res.send("Home Page.")
})

app.post('/sign-up', (req, res) => {
    const user = req.body.user
    const password = req.body.password
    if(users.has(user)){
        res.status(409)
        res.send(`User with username: ${user} already exists.`)
    } else {
        users.set(user, password)
        res.send(`User Created.`)
    }
})

app.post('/sign-in', (req, res) => {
    const user = req.body.user
    const password = req.body.password
    messagesForUser = messages[user] || []
    if(users.has(user) && users.get(user) === password) {
        res.json({
            link: user,
            messages: messagesForUser
        })
    } else {
        res.status(404);
        res.send('User does not exists with this userId and password.')
    }

})

app.post('/send/:user', (req, res) => {
    const user = req.params.user
    const message = req.body.message
    messages[user] = messages[user] || [];
    if(users.has(user)){
        messages[user].push(message)
        res.send('Message received.')
    } else {
        res.status(400)
        res.send('Invalid request.')
    }
})

app.get('/users', (req, res) => {
    const admin = req.body.admin
    const password = req.body.password
    if(admin === 'admin' && password === 'password'){
        res.json(Object.fromEntries(users))
    } else {
        res.status(400)
        res.send('Bad request.')
    }
})

app.get('/messages', (req, res) => {
    const admin = req.body.admin
    const password = req.body.password
    if(admin === 'admin' && password === 'password'){
        res.json(messages)
    } else {
        res.status(400)
        res.send('Bad request.')
    }
})

app.listen(3000)