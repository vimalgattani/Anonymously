import express from 'express';
import { signUp, signIn, sendMessage } from '../controllers/users.controller.js';
const router = express.Router(); 

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/send/:user', sendMessage);

export {router as userRoutes}