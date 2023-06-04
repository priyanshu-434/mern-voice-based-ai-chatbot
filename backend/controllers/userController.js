import asyncHandler from 'express-async-handler';

import generateToken from '../utils/generateToken.js';
import User from '../models/userModel.js';

import { Configuration, OpenAIApi } from 'openai';

// @desc    Register a new user
// route    POST /api/users/register
// @access  Public
const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error("All fields are required");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }

    const user = await User.create({
        name,
        email,
        password
    })

    if (user) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(400);
        throw new Error("Invalid user data");
    }

});

// @desc    Auth user/set token
// route    POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        generateToken(res, user._id);
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email
        });
    } else {
        res.status(401);
        throw new Error("Invalid credentials");
    }

});

// @desc    Logout a new user
// route    POST /api/users/logout
// @access  Public
const logoutUser = asyncHandler(async (req, res) => {

    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({ message: "User logged out" });
});


// @desc    chatbot
// route    POST /api/users/chat
// @access  Private
const chat = asyncHandler(async (req, res) => {
    const { prompt } = req.body;

    const user = await User.findById(req.user._id);

    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const completion = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
    });

    const response = completion.data.choices[0].message.content;

    user.interactions.push({ prompt, response });

    await user.save();

    res.status(200).json({ prompt, response });

});

// @desc    chats
// route    GET /api/users/history
// @access  Private
const getChatHistory = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    // res.status(200).json(user.interactions);
    const chatHistory = user.interactions;
    res.status(200).json(chatHistory);

});

/*------------------------------*/

// @desc    Get user profile
// route    GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req, res) => {

    const user = {
        _id: req.user._id,
        name: req.user.name,
        email: req.user.email
    };

    res.status(200).json(user);
});

// @desc    Update user profile
// route    PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email
        });

    } else {
        res.status(404);
        throw new Error("User not found");
    }
});

//     /** My code
//         const { name, email } = req.body;

//         let user = await User.findByIdAndUpdate(req.user._id, { name, email });
//         user = await User.findById(req.user._id);

//         res.status(200).json({
//             id: user._id,
//             name: user.name,
//             email: user.email
//         });
//         */
// });

export {
    registerUser,
    authUser,
    logoutUser,
    getUserProfile,
    updateUserProfile,
    chat,
    getChatHistory,
}