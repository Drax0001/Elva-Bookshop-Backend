import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    telnumber: {
        type: Number,
        required: true
    },
    role: {
        type: String,
        default: 'admin',
    },
    password: {
        type: String,
        required: true
    }
},
{
    timestamps: true
})

export const User = mongoose.model('User', userSchema)