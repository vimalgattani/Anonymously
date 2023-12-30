import jwt from 'jsonwebtoken';
import 'dotenv/config.js'

const SECRET_KEY = process.env.SECRET_KEY;

// If a cookie with jwt is already present and is valid, redirect the user to messages screen.
// If cookie is not present or is not valid, redirect to sign-up/sign-in page.
const redirector = (req, res, next) => {
    const token = req.cookies.jwt
    if (token) {
        try {
            const user = jwt.verify(token, SECRET_KEY);
            req.user = user;
            next();
        } catch (error) {
            console.log("Token expired or invalid.");
            res.redirect("/user/sign-in");
        }
    } else {
        console.log('Access denied. No token provided.');
        res.redirect('/user/sign-in');
    }
}



export {redirector}