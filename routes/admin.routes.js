import express from 'express';
import { getAllUsers, getAllMessages } from '../controllers/admin.controller.js';
const router = express.Router(); 

router.get('/users', getAllUsers);
router.get('/messages', getAllMessages);

export {router as adminRoutes}