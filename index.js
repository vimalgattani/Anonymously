import express, { json } from 'express'
import { adminRoutes } from './routes/admin.routes.js'
import { userRoutes } from './routes/users.routes.js'
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express()

app.use(json());
app.use(cookieParser());
// const cors = require("cors");
app.use(express.json());

app.use(cors({ origin: true ,credentials: true,}));


app.use((req, res, next) => {
    console.log()
    console.log(`${req.method} ${req.url}`)
    next()
})

app.get('/', (req, res) => {
    res.send("Home Page.")
})

app.use("/user", userRoutes);
app.use("/admin", adminRoutes);

app.listen(3001)