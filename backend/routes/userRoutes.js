import express from "express";

import {
    registerUser,
    authUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    chat,
    getChatHistory,
} from "../controllers/userController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post('/', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.route('/chat').post(protect, chat);
router.route('/history').get(protect, getChatHistory);
router.route('/profile').get(protect, getUserProfile).post(protect, updateUserProfile);
// router.get('/profile', getUserProfile);
// router.put('/profile', updateUserProfile);

export default router;