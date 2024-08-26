import express from "express";
import mongoose from "mongoose";
import cookieParser from 'cookie-parser'
import { config } from "dotenv";
import cors from "cors";
import { connectDB } from "./config/dbConnect.js";
import { Book } from "./models/Book.js";
import { User } from "./models/User.js";
import booksRoute from "./routes/booksRoute.js"
import usersRoute from "./routes/usersRoute.js";
const PORT = 8000;

config()

const app = express();

// Middleware for handling CORS POLICY
app.use(cors()) //Accept every access to the server from any origins and all methods
// app.use(
//     cors({
//         origin: 'http://localhost:5173',
//         methods: ['GET', 'POST', 'PUT', 'DELETE'],
//         allowedHeaders: ['Content-Type'],
//     })
// )

// Connect to MongoDB
connectDB()

// Handle JSON transactions
app.use(express.json())
//Cookie parser middleware
app.use(cookieParser())
app.use(express.urlencoded({ extended: false }))
// Use Book Router
app.use('/books', booksRoute)
app.use('/users', usersRoute)

app.get('/search', async (req, res) => {
    const { q } = req.query;
    try {
        const books = await Book.find({
            $or: [
                { title: {$regex: new RegExp(q, 'i')} }, // Case-insensitive search for title
                { author: {$regex: new RegExp(q, 'i')} } // Case-insensitive search for title
            ]
        })
        // const keys = ["title", "author"];
    
        // const search = (data) => {
        //     // return data.filter((item) =>
        //     //     keys.some((key) => item[key].toLowerCase().includes(q))
        //     // );
        //     const result = data.filter((item) => item['author'].toLowerCase().includes(q));
        //     return result
        // };
    
        // q ? res.json(search(books).slice(0, 10)) : res.json(books.slice(0, 10));
        res.json({booksCount: books.length, data: books});

    } catch(err) {
        console.log(err);
        res.status(500).send(err.message);
    }
});

mongoose.connection.once('open', () => {
    console.log('Connected to database');
    app.listen(PORT, () => {
        console.log('Server is Listening!');
    })
})

