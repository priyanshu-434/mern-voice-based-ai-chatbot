import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from 'path';

import connectDB from "./config/db.js";

import { notFound, errorHandler } from "./middlewares/errorMiddleware.js";

import userRoutes from "./routes/userRoutes.js";

// setup .env file
dotenv.config();

const port = process.env.PORT || 5000;

// connect to database
connectDB();

const app = express();

// setup cookie parser
app.use(cookieParser());

// setup body parser
app.use(express.json());
// allow to send form data as well
app.use(express.urlencoded({ extended: true }));

// for production
if (process.env.NODE_ENV === 'production') {
    const __dirname = path.resolve();
    app.use(express.static(path.join(__dirname, 'frontend/dist')));

    app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html')));
} else {
    app.get('/', (req, res) => res.send("Server is ready"));
}

app.listen(port, () => {
    console.log(`Server listening on port: ${port}`);
});

app.use('/api/users', userRoutes);

// put error handler at the bottom
app.use(notFound);
app.use(errorHandler);