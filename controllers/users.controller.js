import { getUserIfExists, query } from '../db/index.js'
import bcrypt from 'bcrypt';


const signUp = async (req, res) => {
    const user = req.body.user
    const password = req.body.password

    let userObj = await getUserIfExists(user)

    if(userObj.exists){
        res.status(409)
        res.send(`User with username: ${user} already exists.`)
    } else {
        const hashedPassword = await bcrypt.hash(password, 17);
        query('INSERT INTO users(name, password) VALUES ($1, $2) RETURNING *', [user, hashedPassword], (error, results) => {
            if(error){
                throw error
            }
            res.send(`User with id: ${results.rows[0].id} and username: ${results.rows[0].name} created.`)
        })
    }
}

const signIn = async (req, res) => {
    const user = req.body.user
    const password = req.body.password
    let userObj = await getUserIfExists(user)

    if(userObj.exists) {  
        const passwordCheck = await bcrypt.compare(password, userObj.user.password);
        if (!passwordCheck) {
            res.status(400).json({ error: "Invalid Password." });
        }
        query('SELECT message FROM messages WHERE user_id = $1 ORDER BY record_time DESC', [userObj.user.id], (error, results) => {
            if(error){
                throw error
            }
            res.json({
                link: user,
                messages: results.rows.map((row)=>row.message)
            })
        })
    } else {
        res.status(404);
        res.send('User does not exists with this userName and password.')
    }
}

const sendMessage = async (req, res) => {
    const user = req.params.user
    const message = req.body.message
    let userObj = await getUserIfExists(user)
    if(userObj){
        query('INSERT INTO messages(user_id, message) VALUES($1, $2)', [userObj.user.id, message], (error, results) => {
            if(error){
                throw error
            }
            res.send('Message received.')
        })
    } else {
        res.status(400)
        res.send('Invalid request.') // The user whom message is to be sent doesn't exists.
    }
}

export {signUp, signIn, sendMessage}