import { getUserIfExists, query } from '../db/index.js'
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config.js'

const SECRET_KEY = process.env.SECRET_KEY;

const signUp = async (req, res) => {
    const user = req.body.user
    const password = req.body.password

    try{
        let userObj = await getUserIfExists(user)

        if(userObj.exists){
            res.status(409).json({error: `User with username: ${user} already exists.` })
        } else {
            const hashedPassword = await bcrypt.hash(password, 17);
            query('INSERT INTO users(name, password) VALUES ($1, $2) RETURNING *', [user, hashedPassword], (error, results) => {
                if(error){
                    throw error
                }
                const expirationTime = Math.floor(Date.now() / 1000) + 3600; // Current time + 3600 seconds (1 hour)
                const payloadToSign = { username: user, id: results.rows[0].id, exp: expirationTime };
                const token = jwt.sign(payloadToSign, SECRET_KEY);
                res.cookie('jwt', token, {
                    httpOnly: true,  // Restricts JavaScript access
                    // secure: true,    // Ensures the cookie is sent over HTTPS only
                    sameSite: 'strict', // Optional, helps protect against cross-site request forgery (CSRF) attacks
                });
                res.status(201).json({userId: results.rows[0].id, userName: results.rows[0].name})
            })
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Something went wrong."});
    }
}

const signIn = async (req, res) => {
    const user = req.body.user
    const password = req.body.password
    
    try {
        let userObj = await getUserIfExists(user)

        if(userObj.exists) {  
            const passwordCheck = await bcrypt.compare(password, userObj.user.password);
            if (!passwordCheck) {
                res.status(400).json({ error: "Invalid Password." });
            }
            const expirationTime = Math.floor(Date.now() / 1000) + 3600; // Current time + 3600 seconds (1 hour)
            const payloadToSign = { username: user, id: userObj.user.id, exp: expirationTime };
            const token = jwt.sign(payloadToSign, SECRET_KEY);
            res.cookie('jwt', token, {
                httpOnly: true,  // Restricts JavaScript access
                // secure: true,    // Ensures the cookie is sent over HTTPS only
                sameSite: 'strict', // Optional, helps protect against cross-site request forgery (CSRF) attacks
            });
            res.status(201).json({message: "User authenticated.", userId: userObj.user.id, userName: userObj.user.name});
        } else {
            res.status(404).json({error: 'User does not exists with this userName and password.'})
        }
    } catch(error) {
        console.log(error);
        res.status(500).json({error: "Something went wrong."});
    }
}

const signOut = (req, res) => {
    if (req.cookies.jwt) {
        // If the JWT cookie exists, clear it
        res.clearCookie('jwt');
        res.status(200).json({message: 'Logout successful'});
    } else {
        // The cookie doesn't exist, so you can handle this case accordingly
        res.status(200).json({message: 'No user logged in.'});
    }
}

const fetchMessagesByUserId = async (req, res) => {
    const user = req.user;
    try {
        query('SELECT message FROM messages WHERE user_id = $1 ORDER BY record_time DESC', [user.id], (error, results) => {
            if(error){
                throw error
            }
            res.status(200).json({
                userId: user.id,
                messages: results.rows.map((row)=>row.message)
            })
        })
    } catch(error) {
        console.log(error);
        res.send(500).json({error: "Something went wrong."});
    }
    
}

const sendMessage = async (req, res) => {
    const user = req.params.user
    const message = req.body.message
    let userObj = await getUserIfExists(user)
    if(userObj.exists){
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

export {signUp, signIn, sendMessage, fetchMessagesByUserId, signOut};