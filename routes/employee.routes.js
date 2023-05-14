import express from 'express'
const router = express.Router()
// import {protect,private} from '../middleware/authMiddleware'
import {
    inviteEmployeeController,
    createInviteEmployee,
    createInviteEmployeeBulk,
    registerEmployee,
    loginEmployee,
    changeEmployeePassword,
    updateProfile,
    employeeForgetPassword,
    employeeResetPassword,
    checkEmployeeForgetPasswordToken,
    employeeLeaveApplication,
    employeeLeavestatus,
    viewLeaveApplicattion,
    deleteApplication,
    employeeAttendenceController,
    getAttendence,
    
} from '../controllers/employee.controllers.js'
// import auth
import {
    protectEmployee
} from '../middleware/employee.auth.js'
import {
    protect,
    HRcheck
} from '../middleware/auth.middleware.js'

// to inviteEmployee
/**
 * @swagger 
 * /employee/invite-employee:
 *  post:
 *   summary: invite multiple employee together at once
 *   tags:
 *    - invite-employee-routes
 *   description: invitation in group to the employees
 *   parameters:
 *    - in: body
 *      name: = invitaton to the employees 
 *      description: will require "email" 
 *      schema:
 *       type: object
 *       properties:
 *        data:
 *          type: array
 *       example:
 *        data: [{"first_name":"ammm", "last_name":"bbb","email":"rupanbiswas08@gmail.com"}]
 *   responses:
 *    "200":
 *     description: invitation send
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: invition failed
 *     content:
 *      application/json:
 *       type: object
 */
router.route('/invite-employee').post(protect, HRcheck, createInviteEmployee)
// to inviteEmployee
/**
 * @swagger 
 * /employee/invite-employee/bulk:
 *  post:
 *   summary: invite many emplyee at one with form data from csv
 *   tags:
 *    - invite-employee-routes
 *   description: invitation in group to the employees from csv
 *   parameters:
 *    - in: body
 *      name: = invitaton to the employees 
 *      description: will require "email" 
 *      schema:
 *       type: object
 *       properties:
 *        hr_id:
 *         type: string
 *        organisation_id:
 *         type: string
 *        data:
 *          type: json
 *       example:
 *        hr_id: "sndnsdnsjndjsndjnsjkdns"
 *        organisation_id: "sndnsdnsjndjsnd"
 *        data: [{"position":"employee","first_name":"ammm", "last_name":"bbb","email":"rupanbiswas08@gmail.com"}]
 *   responses:
 *    "200":
 *     description: invitation send
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: invition failed
 *     content:
 *      application/json:
 *       type: object
 */
router.route('/invite-employee/bulk').post(protect,HRcheck,createInviteEmployeeBulk)


/**
 * @swagger 
 * /employee/invite-employee:
 *  get:
 *   summary: to check th invitation validation of the employee
 *   tags:
 *    - invite-employee-routes
 *   description: for the verification verification of employee
 *   parameters:
 *       - name: email
 *         in: query
 *         description: email of the employee
 *         required: true
 *         type: string
 *       - name: token
 *         in: query
 *         description: Token of the employee
 *         required: true
 *         type: string  
 *   responses:
 *    200:
 *     description: valid true
 *     content:
 *      application/json:
 *         type: object
 *    404:
 *     description: not valid email or token
 *     content:
 *      application/json:
 *         type: object
 *    400:
 *     description: token expired
 *     content:
 *      application/json:
 *         type: object
 */

router.route('/invite-employee').get(inviteEmployeeController)



/**
 * @swagger 
 * /employee/register-employee:
 *  post:
 *   summary: registration of the employee
 *   tags:
 *    - employee-routes
 *   description: after getting invited a verification mail is send to verify employee and now will get registered
 *   parameters:
 *    - in: body
 *      name: register
 *      description: will require "firstName","lastName" , "email" , "password" ,"organisationName", "phoneNumber" , "websiteURL" ,"address","country" and "numberOfEmployees"
 *      schema:
 *       type: object
 *       properties:
 *        token:
 *         type: string
 *        email:
 *         type: string
 *        gender:
 *         type: string
 *        password:
 *         type: string
 *        phone_number:
 *         type: number
 *        address:
 *         type: string
 *        country:
 *         type: string
 *       example:
 *        token : 15h9bdfid75fg93a2669gf47hcahaa32
 *        password: rupan
 *        email: rupanbiswas08@gmail.com
 *        gender: male
 *        phone_number: 7908988244
 *        address: naxalbari
 *        country: India
 *   responses:
 *    201:
 *     description: the employee databsae is created and and verified
 *     content:
 *      application/json:
 *         type: object
 *    404:
 *     description: success error ot not verified
 *     content:
 *      application/json:
 *         type: object
 *    500:
 *     description: server error
 *     content:
 *      application/json:
 *         type: object
 */

router.route('/register-employee').post(registerEmployee)


// to login employee and get login tokens
/**
 * @swagger 
 * /employee/login-employee:
 *  post:
 *   summary: employee login
 *   tags:
 *    - employee-routes
 *   description: to get  loged in and get authentication token 
 *   parameters:
 *    - in: body
 *      name: = login employee
 *      description: will require "email" and "password" to login
 *      schema:
 *       type: object
 *       properties:
 *        email:
 *         type: string
 *        password:
 *         type: string
 *       example:
 *        email: rupanbiswas08@gmail.com
 *        password: rupan   
 *   responses:
 *    200:
 *     description: the employee is logged and accepted token
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
 */

router.route('/login-employee').post(loginEmployee)

// routes to change password
/**
 * @swagger 
 * /employee/change-password:
 *  put:
 *   summary: change password of employee with new password after been token verified
 *   tags:
 *    - employee-routes
 *   description: change new password
 *   parameters:
 *    - in: body
 *      name: = forget password 
 *      description: will require new password 
 *      schema:
 *       type: object   
 *       properties:
 *        new_password:
 *         type: string
 *       example:
 *        new_password: nnknfknd
 *   responses:
 *    201:
 *     description: success true password updated
 *     content:
 *      application/json:
 *         type: object
 *    400:
 *     description: cannot reset password with error
 *     content:
 *      application/json:
 *         type: object
 */
router.route('/change-password').put(protectEmployee,changeEmployeePassword)


// routes to change password
/**
 * @swagger 
 * /employee/update-profile:
 *  put:
 *   summary: update profile of the employee
 *   tags:
 *    - employee-routes
 *   description: update profile of the employee
 *   parameters:
 *    - in: body
 *      name: = update profile of the employee
 *      description: to update general info of the employee
 *      schema:
 *       type: object   
 *       properties:
 *        first_name:
 *         type: string
 *        last_name:
 *         type: string
 *        address:
 *         type: string
 *        country:
 *         type: string
 *        gender:
 *         type: string
 *        phone_number:
 *          type: number
 *       example:
 *        first_name: disco
 *        last_name: dancer
 *        address: asguard
 *        country: mars
 *        gender: mail
 *        phone_number: 1234567891
 *   responses:
 *    201:
 *     description: success true profile updated
 *     content:
 *      application/json:
 *         type: object
 *    404:
 *     description: cannot update profile with error
 *     content:
 *      application/json:
 *         type: object
 */
router.route('/update-profile').put(protectEmployee,updateProfile)


/**
 * @swagger 
 * /employee/employee-forget-password:
 *  post:
 *   summary: enter email to reset password of employee
 *   tags:
 *    - employee-routes
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
 *    "200":
 *     description: mail sent
 *     content:
 *      application/json:
 *       type: object
 *    "400":
 *     description: employee not found
 *     content:
 *      application/json:
 *       type: object
 */

router.route('/employee-forget-password').post(employeeForgetPassword)


/**
 * @swagger 
 * /employee/employee-forget-password:
 *  get:
 *   summary: token verification for forget password of employee
 *   tags:
 *    - employee-routes
 *   description: to  check verification token for forget password of employee
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

router.route('/employee-forget-password').get(checkEmployeeForgetPasswordToken)

/**
 * @swagger 
 * /employee/employee-forget-password:
 *  put:
 *   summary: reset password of employee with new password after been token verified and set token verified true
 *   tags:
 *    - employee-routes
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
 *    201:
 *     description: success true password updated
 *     content:
 *      application/json:
 *         type: object
 *    400:
 *     description: cannot reset password with error
 *     content:
 *      application/json:
 *         type: object
 */

router.route('/employee-forget-password').put(employeeResetPassword)




/**
 * @swagger 
 * /employee/leave-application:
 *  post:
 *   summary: to apply for leave
 *   tags:
 *    - employee-routes
 *   description: to apply leave by the employee to the employer
 *   parameters:
 *    - in: body
 *      name: = apply for leave application
 *      description: will require start date and end date with reason
 *      schema:
 *       type: object
 *       properties:
 *        startDate:
 *         type: string
 *        endDate:
 *         type: string
 *        reason:
 *         type: string
 *        count:
 *         type: number
 *       example:
 *        startDate: "2021-08-08"
 *        endDate: "2021-08-10"
 *        reason: "meri marji"
 *        count: 1.5
 *   responses:
 *    "201":
 *     description: leave application applied
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
router.route('/leave-application').post(protectEmployee,employeeLeaveApplication)


/**
 * @swagger 
 * /employee/leave-application:
 *  put:
 *   summary: to accept the leave application
 *   tags:
 *    - employee-routes
 *   description: acception and allowing the leave application
 *   parameters:
 *    - in: body
 *      name: = to accept the leave application
 *      description: to accept the leave application
 *      schema:
 *       type: object   
 *       properties:
 *        application_id:
 *         type: string
 *       example:
 *        application_id: sbdbsbdjsbdjsjdbjb872y8
 *   responses:
 *    "201":
 *     description: application accepted
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
router.route('/leave-application').put(protect,HRcheck,employeeLeavestatus)


/**
 * @swagger 
 * /employee/leave-application:
 *  get:
 *   summary: to get all the leave application applied
 *   tags:
 *    - employee-routes
 *   description: to get all the leave application applied in an organisation
 *   parameters:
 *   responses:
 *    "200":
 *     description: status true
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: not found
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object
 */
router.route('/leave-application').get(protect,HRcheck,viewLeaveApplicattion)


/**
 * @swagger 
 * /employee/leave-application:
 *  delete:
 *   summary: to delete the leave application
 *   tags:
 *    - employee-routes
 *   description: delete the leave application
 *   parameters:
 *    - in: body
 *      name: = to delete the leave application
 *      description: to delete the leave application
 *      schema:
 *       type: object   
 *       properties:
 *        application_id:
 *         type: string
 *       example:
 *        application_id: sbdbsbdjsbdjsjdbjb872y8
 *   responses:
 *    "200":
 *     description: application deleted
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: application not found
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object
 */
router.route('/leave-application').delete(protect,HRcheck,deleteApplication)

/**
 * @swagger 
 * /employee/attendence:
 *  post:
 *   summary: attendence of an employee
 *   tags:
 *    - employee-routes
 *   description: checkin and checkout attendence of an employee
 *   parameters:
 *    - in: body
 *      name: = attendence of an employee
 *      description: attendence of an employee
 *      schema:
 *       type: object
 *       properties:
 *        created_by:
 *         type: string
 *        position:
 *         type: string
 *        check_in:
 *         type: boolean
 *        check_out:
 *         type: boolean
 *       example:
 *        created_by: "hbsdjbsbdjbsbd"
 *        position: "HR"
 *        check_in: true
 *        check_out: false
 *   responses:
 *    "201":
 *     description: attendence noted
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: notation of attendence failed
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object
 */
router.route('/attendence').post(employeeAttendenceController)


/**
 * @swagger 
 * /employee/get-attendence:
 *  get:
 *   summary: to get all personal attendencce
 *   tags:
 *    - employee-routes
 *   description: to get all the attendence of the employee
 *   parameters:
 *   responses:
 *    "200":
 *     description: status true
 *     content:
 *      application/json:
 *       type: object
 *    "404":
 *     description: not found
 *     content:
 *      application/json:
 *       type: object
 *    "500":
 *       description: internal server error 
 *       content:
 *        application/json:
 *         type: object
 */
router.route('/get-attendence').get(getAttendence)

export default router