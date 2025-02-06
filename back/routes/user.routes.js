import express from 'express';
import { getUser,  getAllUsers, createNewUser, updateUser, deleteUser } from '../controllers/user.controller.js';
import {authMiddleware, admin} from '../middleware/auth.middleware.js';
import errorHandler from '../middleware/error.middleware.js';
const router = express.Router();

router.get('/', authMiddleware, admin, errorHandler, getAllUsers);
router.get('/me', authMiddleware,admin, errorHandler, getUser);
router.post('/',authMiddleware,admin, errorHandler, createNewUser);
router.put('/:id', authMiddleware, admin, errorHandler, updateUser);
router.delete('/:id', authMiddleware, admin, errorHandler, deleteUser);

export default router;