import mongoose from "mongoose";
import { Schema } from "mongoose";

const bookSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
}, 
{
    timestamps: true
})

export const Book = mongoose.model('Book', bookSchema);

