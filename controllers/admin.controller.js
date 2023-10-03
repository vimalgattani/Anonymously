import { query } from '../db/index.js'
import 'dotenv/config.js'

const getAllUsers = (req, res) => {
    const admin = req.body.admin
    const password = req.body.password
    let users = []
    query('SELECT * FROM users ORDER BY id ASC', (error, results) => {
        if(error) {
            throw error
        }
        users = results.rows
        if (admin === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            res.json(users);
        } else {
            res.status(400).send('Bad request.');
        }
    })
}

const getAllMessages = (req, res) => {
    const admin = req.body.admin
    const password = req.body.password
    let messages = []
    query('SELECT user_id, array_agg(message) as msgs FROM messages GROUP BY user_id', (error, results) => {
        if(error){
            throw error
        }
        messages = results.rows
        if (admin === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
            res.json(messages)
        } else {
            res.status(400)
            res.send('Bad request.')
        }
    })   
}

export {getAllUsers, getAllMessages}