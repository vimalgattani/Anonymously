import express, { json } from 'express'
import { adminRoutes } from './routes/admin.routes.js'
import { userRoutes } from './routes/users.routes.js'

const app = express()

app.use(json())

app.use((req, res, next) => {
    console.log()
    console.log(`${req.url}`)
    next()
})

app.get('/', (req, res) => {
    res.send("Home Page.")
})

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(3000)