import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const forgotPasswordVerification = mongoose.Schema({
    hr: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'HR'
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


const forgotPasswordToken = mongoose.model('forgotPassword', forgotPasswordVerification);
export default forgotPasswordToken