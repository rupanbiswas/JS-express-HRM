import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import HR from '../models/HR.model.js'

const protect = asyncHandler(async (req, res, next) => {
    let token


    // console.log("yoo"+req.headers.authorization);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {

            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.hr = await HR.findById(decoded.id).select('-password')
            next()
        } catch (error) {


            console.error(error)
            res.status(401)
            throw new Error('Not Authorised,token failed')
        }
    }

    if (!token) {
        res.status(401)
        throw new Error('not authorized,no token ')
    }

})




const HRcheck = (req, res, next) => {
    if (req.hr && req.hr.HR == true) {
        next()
    } else {
        res.status(401)
        throw new Error('Not Authorised as an HR')
    }
}


export {
    protect,
    HRcheck
}