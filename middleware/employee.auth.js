import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import employeeModel from '../models/employee.model.js'

const protectEmployee = asyncHandler(async (req, res, next) => {
    let token


    // console.log("yoo"+req.headers.authorization);
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {

            token = req.headers.authorization.split(' ')[1]

            const decoded = jwt.verify(token, process.env.JWT_SECRET)
            req.employee = await employeeModel.findById(decoded.id).select('-password')
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





export {
    protectEmployee,
}