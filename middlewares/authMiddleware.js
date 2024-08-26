import jwt from 'jsonwebtoken'
import { User } from '../models/User.js'

export const protect = async (req, res, next) => {
    let token

    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            // Get token from header
            token = req.headers.authorization.split(' ')[1]

            // Verify Token
            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.user = await User.findById(decoded.id)

            next()
        } catch (err) {
            console.log(err);
            res.status(401)
            res.send(err)
        }
    } 

    if(!token) {
        res.status(401)
        res.send('no token');
    }
}