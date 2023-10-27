import express from 'express';
import { signUp, signIn, sendMessage, fetchMessagesByUserId, signOut } from '../controllers/users.controller.js';
import { redirector } from '../middleware/checkAuthentication.js';
const router = express.Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/send/:user', sendMessage);
router.get('/messages', redirector, fetchMessagesByUserId);
router.delete('/sign-out', signOut);

export {router as userRoutes}