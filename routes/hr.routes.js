import express from 'express'
import { allotEmployeeLeave, employeeAllotedLeaves, getHolidays, holidayController, imageUpload, updateEmployeeLeave, updateHoliday } from '../controllers/hr.controllers.js'
const router = express.Router()
// import {protect,private} from '../middleware/authMiddleware'
import {
    hrRegister,
    hrVerification,
    authHR,
    newForgotPasswords,
    forgotPassword,
    changePassword,
    checkForgetPasswordToken,
    updateAllotedLeave,
    allotedLeave,
    getAllotedLeaves,
    employeeAttendenceSummary,
    
} from '../controllers/hr.controllers.js'
// import auth
import {
    protect,
    HRcheck
} from '../middleware/auth.middleware.js'

import multer from "multer";
var upload =multer({dest:'uploads/'})

/**
 * @swagger 
 * /hr/register:
 *  post:
 *   summary: this route helps to get registered to an employee and careate organisation with the details to be filled
 *   tags:
 *    - HR-routes
 *   description: eneter details to get verification mail and get registered 
 *   parameters:
 *    - in: body
 *      name: register
 *      description: will require "firstName","lastName" , "email" , "password" ,"organisationName", "phoneNumber" , "websiteURL" ,"address","country" and "numberOfEmployees"
 *      schema:
 *       type: object
 *       properties:
 *        first_name:
 *         type: string
 *        last_name:
 *         type: string
 *        email:
 *         type: string
 *        gender:
 *         type: string
 *        password:
 *         type: string
 *        organisation_name:
 *         type: string
 *        phone_number:
 *         type: number
 *        websiteURL:
 *         type: string
 *        address:
 *         type: string
 *        country:
 *         type: string
 *        number_of_employees:
 *         type: number
 *       example:
 *        first_name: Rupan
 *        last_name: Biswas
 *        password: rupan
 *        email: rupan@gmail.com
 *        gender: male
 *        organisation_name: rupan
 *        phone_number: 7908988244
 *        websiteURL: http:www.gfgfgf.com
 *        address: naxalbari
 *        country: India
 *        number_of_employees: 10
 *   responses:
 *    201:
 *     description: the hr databsae and organisation database are created and verification mail are sent
 *     content:
 *      application/json:
 *         type: object
 *    200:
 *     description: hr exists and verification mail is sent
 *     content:
 *      application/json:
 *         type: object
 *    400:
 *     description: hr exists
 *     content:
 *      application/json:
 *         type: object
 *    404:
 *     description: hr not created please try again later
 *     content:
 *      application/json:
 *         type: object
 */
router.route('/register').post(hrRegister)
/**
 * @swagger 
 * /hr/register:
 *  put:
 *   summary: hr and organisation verification after getting the link in mail and clicking on in by which we get token and email
 *   tags:
 *    - HR-routes
 *   description: after mail is verified database is updated to verified true in token,hr and organisation
 *   parameters:
 *    - in: body
 *      name: register verification
 *      description: will require "token" for "email" verification and email
 *      schema:
 *       type: object
 *       properties:
 *        token:
 *         type: string
 *        email:
 *         type: string
 *       example:
 *        token: ndjsnjdnjnsjndjnsjndnsjn
 *        email: rupanbiswas18rb@gmail.com
 *   responses:
 *    201:
 *     description: the hr is verified and and success true is responded
 *     content:
 *      application/json:
 *         type: object
 *    404:
 *     description: email verification failed
 *     content:
 *      application/json:
 *         type: object
 *    500:
 *     description: internal server error
 *     content:
 *      application/json:
 *         type: object
 *
 */
router.route('/register').put(hrVerification)


// to login hr and get login tokens
/**
 * @swagger 
 * /hr/login:
 *  post:
 *   summary: hr login or user can login through google too
 *   tags:
 *    - HR-routes
 *   description: to get  loged in and get authentication token token
 *   parameters:
 *    - in: body
 *      name: = login hr 
 *      description: will require "email" and "password" to login
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *        password:
 *         type: string
 *       example:
 *        email: rupanbiswas18rb@gmail.com
 *        password: rupan   
 *   responses:
 *    201:
 *     description: the hr is created and returns token
 *     content:
 *      application/json:
 *         type: object
 *         items:
 *    404:
 *     description: invalid user name or password
 *     content:
 *      application/json:
 *         type: object
 *         items:
 *    500:
 *     description: internal server error
 *     content:
 *      application/json:
 *         type: object
 *         items:
 *          $ref: '#/hr/login'
 */   
router.route('/login').post(authHR)


// routes for forget password

/**
 * @swagger 
 * /hr/forgot-password:
 *  post:
 *   summary: enter email to reset password of HR
 *   tags:
 *    - HR-routes
 *   description: sends verification token for forget password through mail
 *   parameters:
 *    - in: body
 *      name: = forget password 
 *      description: will require "email" 
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *       example:
 *        email: rupanbiswas18rb@gmail.com
 *   responses:
 *    "201":
 *     description: mail sent
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object

 */
router.route('/forgot-password').post(forgotPassword)

/**
 * @swagger 
 * /hr/forgot-password:
 *  get:
 *   summary: token verification for forget password of HR
 *   tags:
 *    - HR-routes
 *   description: to  check verification token for forget password of hr
 *   parameters:
 *       - name: email
 *         in: query
 *         description: email of the hr
 *         required: true
 *         type: string
 *       - name: token
 *         in: query
 *         description: Token of the hr
 *         required: true
 *         type: string  
 *   responses:
 *    200:
 *     description: verification true with id
 *     content:
 *      application/json:
 *         type: object
 *    400:
 *     description: connot reset password
 *     content:
 *      application/json:
 *         type: object
 */
router.route('/forgot-password').get(checkForgetPasswordToken)

/**
 * @swagger 
 * /hr/forgot-password:
 *  put:
 *   summary: reset password of HR with new password after been token verified and set token verified true
 *   tags:
 *    - HR-routes
 *   description: reset new password
 *   parameters:
 *    - in: body
 *      name: = forget password 
 *      description: will require "_id" , "token" and new password 
 *      schema:
 *       type: object   
 *       properties:
 *        _id:
 *         type: string
 *        token:
 *         type: string
 *        new_password:
 *         type: string
 *       example:
 *        _id: jnsjdnjsnkdnksnkdnksnd
 *        token: nnknfkndknfkndknfjndfn
 *        new_password: nnknfknd
 *   responses:
 *    "201":
 *     description: forgot password verified
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object

 */
router.route('/forgot-password').put(newForgotPasswords)

// routes to change password
/**
 * @swagger 
 * /hr/change-password:
 *  put:
 *   summary: change password of HR with new password after been token verified
 *   tags:
 *    - HR-routes
 *   description: change new password
 *   parameters:
 *    - in: body
 *      name: = change password
 *      description: will require new password 
 *      schema:
 *       type: object   
 *       properties:
 *        new_password:
 *         type: string
 *       example:
 *        new_password: nnknfknd
 *   responses:
 *    "201":
 *     description: password changed
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object

 */
router.route('/change-password').put(protect,HRcheck,changePassword)


/**
 * @swagger 
 * /hr/hr-alloted-leaves:
 *  post:
 *   summary: to allot leave to the organisation
 *   tags:
 *    - HR-routes
 *   description: allot leaves to the organisation for a year
 *   parameters:
 *    - in: body
 *      name: = alloted leaves
 *      description: will require employee and organisatio id and the leaves
 *      schema:
 *       type: object
 *       properties:
 *        leaves:
 *         type: array
 *       example:
 *        leaves: [{reason:maternal,number:5},{reason:paid,number:5}] 
 *   responses:
 *    "201":
 *     description: leaves alloted
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: employee not found
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object
 */
 router.route('/hr-alloted-leaves').post(protect,HRcheck,allotedLeave)



 /**
  * @swagger 
  * /hr/hr-alloted-leaves:
  *  put:
  *   summary: update alloted leaves of the organsiation
  *   tags:
  *    - HR-routes
  *   description: update alloted leaves of the organisation
  *   parameters:
  *    - in: body
  *      name: = update alloted leaves of the organisation
  *      description: to update alloted leaves of organisation
  *      schema:
  *       type: object   
  *       properties:
 *        leaves:
 *         type: array
  *       example:
 *        leaves: [{reason:maternal,number:5},{reason:paid,number:5}] 
  *   responses:
  *    "201":
  *     description: leaves updated
  *     content:
  *      application/json:
  *       type: object
  *    "404":
  *     description: employee not found
  *     content:
  *      application/json:
  *       type: object
  *    "500":
  *       description: internal server error 
  *       content:
  *        application/json:
  *         type: object
  */
 router.route('/hr-alloted-leaves').put(protect,HRcheck,updateAllotedLeave)
 

/**
 * @swagger 
 * /hr/hr-alloted-leaves:
 *  get:
 *   summary: to get alloted leaves types and description of an organisation
 *   tags:
 *    - HR-routes
 *   description: to view all the alloted leaves of an organisation
 *   responses:
 *    "201":
 *     description: get alloted types of leaves to an organisation
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object

 */
 router.route('/hr-alloted-leaves').get(protect,HRcheck,getAllotedLeaves)


/**
 * @swagger 
 * /hr/employee-alloted-leaves:
 *  post:
 *   summary: to allot leave to an employee of an organisation
 *   tags:
 *    - HR-routes
 *   description: requires employeeId adn leaves data of an organisation
 *   parameters:
 *    - in: body
 *      name: = post leaves to an employee
 *      description: give datas to update new leaves to an employee 
 *      schema:
 *       type: object   
 *       properties:
 *        employee:
 *         type: string
 *        leaves:
 *         type: array
 *       example:
 *        employee: 60fa689953b2e947e8f00543
 *        leaves: [{medical: 5,casual: 15,earned: 5}]
 *   responses:
 *    "201":
 *     description: leaves posted
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object

 */
 router.route('/employee-alloted-leaves').post(protect,HRcheck,allotEmployeeLeave)


 
/**
 * @swagger 
 * /hr/employee-alloted-leaves:
 *  put:
 *   summary: to update alloted leaves of an employee
 *   tags:
 *    - HR-routes
 *   description: enter the new datas to update leaves of an employee
 *   parameters:
 *    - in: body
 *      name: = change password
 *      description: will require new password 
 *      schema:
 *       type: object   
 *       properties:
 *        employee:
 *         type: string
 *        leaves:
 *         type: array
 *       example:
 *        employee: 60fa689953b2e947e8f00543
 *        leaves: [{medical: 5,casual: 15,earned: 5}]
 *   responses:
 *    "201":
 *     description: update employee allotedLeave
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object

 */
 router.route('/employee-alloted-leaves').put(protect,HRcheck,updateEmployeeLeave)



/**
 * @swagger 
 * /hr/employee-alloted-leaves:
 *  get:
 *   summary: to check th invitation validation of the employee
 *   tags:
 *    - HR-routes
 *   description: to  check verification token for invitation of employee
 *   parameters:
 *       - name: employee
 *         in: query
 *         description: employee _id
 *         required: true
 *         type: string
 *       - name: all
 *         in: query
 *         description: response true or false that you want all data or not
 *         required: true
 *         type: boolean  
 *   responses:
 *    200:
 *     description: to get alloted leaves to an employee
 *     content:
 *      application/json:
 *         type: object
 *    400:
 *     description: can not validate token
 *     content:
 *      application/json:
 *         type: object
 */
 router.route('/employee-alloted-leaves').get(protect,HRcheck,employeeAllotedLeaves)



 /**
 * @swagger 
 * /hr/holiday:
 *  post:
 *   summary: to add hollidays for an organisation
 *   tags:
 *    - HR-routes
 *   description: add holiday for an organisation
 *   parameters:
 *    - in: body
 *      name: = forget password 
 *      description: will require employee and organisatio id and the leaves
 *      schema:
 *       type: object
 *       properties:
 *        datas:
 *         type: array
 *       example:
 *        datas: [{reason:durga puja,number:5},{reason:holi,number:5}] 
 *   responses:
 *    "201":
 *     description: holiday data filled
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object
 */
  router.route('/holiday').post(protect,HRcheck,holidayController)



 
/**
 * @swagger 
 * /hr/holiday:
 *  put:
 *   summary: to update holiday list of an organisation
 *   tags:
 *    - HR-routes
 *   description: enter the new datas to replace with th e old one
 *   parameters:
 *    - in: body
 *      name: = update holiday list
 *      description: will require new password 
 *      schema:
 *       type: object   
 *       properties:
 *        datas:
 *         type: array
 *       example:
 *        datas: [{medical: 5,casual: 15,earned: 5}]
 *   responses:
 *    "201":
 *     description: update holiday list
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object

 */
  router.route('/holiday').put(protect,HRcheck,updateHoliday)

  
/**
 * @swagger 
 * /hr/holiday:
 *  get:
 *   summary: to get alloted leaves of all the employees
 *   tags:
 *    - HR-routes
 *   description: to view all the alloted leaves of the employee of an organisation
 *   responses:
 *    "201":
 *     description: attendence summary
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object
 */
  router.route('/holiday').get(protect,HRcheck,getHolidays)


/**
 * @swagger 
 * /hr/last-month-attendence:
 *  get:
 *   summary: to get attendence of all the employees in csvv format for one month
 *   tags:
 *    - HR-routes
 *   description: enter the start year and month and end year and month to reveive all employees attendence of one month
 *   parameters:
 *       - name: startYear
 *         in: query
 *         description: year
 *         required: true
 *         type: string
 *       - name: endYear
 *         in: query
 *         description: year
 *         required: true
 *         type: string
 *       - name: endMonth
 *         in: query
 *         description: month
 *         required: true
 *         type: string
 *       - name: startMonth
 *         in: query
 *         description: month
 *         required: true
 *         type: string
 *   responses:
 *    200:
 *     description: attendence summary
 *     content:
 *      application/json:
 *         type: object
 *    500:
 *     description: server error
 *     content:
 *      application/json:
 *         type: object
 */

 router.route('/last-month-attendence').get(protect,HRcheck,employeeAttendenceSummary)






/**
 * @swagger 
 * /hr/post-image:
 *  post:
 *   summary: to post logo for an organisation
 *   tags:
 *    - HR-routes
 *   description: upload an image file to post an logo for an organisation
 *   parameters:
 *    - in: body
 *      name: = forget password 
 *      description: will require an image file
 *      schema:
 *       type: object
 *       properties:
 *        image:
 *         type: file
 *       example:
 *        image: sbdbsbdjsbdjsjdbjb872y8 
 *   responses:
 *    "201":
 *     description: logo added
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: error
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object
 */
 router.route('/post-image').post(protect,upload.single('image'),imageUpload)

export default router