import express from 'express';
const router = express.Router();

import {
    me
} from "../controllers/common.controllers.js"

import {
    protectEmployee
} from '../middleware/employee.auth.js'

router.route('/').get(protectEmployee, me)


export default router