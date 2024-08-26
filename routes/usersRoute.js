import express from 'express';
import { User } from '../models/User.js';
import jwt from 'jsonwebtoken'

const router = express.Router();

router.post('/signup', async(req, res) => {
    const { username, email, telnumber, password } = req.body
    try {
        if(!username || !email || !telnumber || !password) {
            return res.status(400).send({
                message: 'Send all required fields'
            })
        }

        const existentUser = await User.findOne({ email })

        if (existentUser) {
            return res.status(400).send({ message: 'This email is already in use'})
        } 

        if(password.length < 8) {
            return res.status(400).send({ message: 'Password should be 8 characters or more' })
        }
            
        const newUser = {
                username: username,
                email: email,
                telnumber: telnumber,
                password: password,
            }
        const user = await User.create(newUser)
        return res.status(201).send({ message: 'Succesfully Signed up!', data: user })
        
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
})

router.post('/login',  async(req, res) => {
    const { email, password } = req.body
    try {
        if(!email || !password) {
            return res.status(400).send({
                message: 'Send all required fields'
            })
        }
        
        const user = await User.findOne({ email: email, password: password})

        if(user) {
            return res.status(201).send({ message: 'Successfully signed in!', data: user, token: generateToken(user._id) })
        } else {
            return res.status(404).send({ message: 'Either the email or password is incorrect!' })
        }
        
    } catch (err) {
        console.log(err)
        res.status(500).send(err.message)
    }
})

const generateToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
    })
}

export default router