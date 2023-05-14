import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeForgotPasswordVerification = mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'employeeModel'
    },
    email: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: false
    },
}, {
    timestamps: true,
}, )


const employeeForgotPasswordToken = mongoose.model('employeeForgotPasswordToken', employeeForgotPasswordVerification);
export default employeeForgotPasswordToken