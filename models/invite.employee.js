import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const inviteEmployeeSchema = mongoose.Schema({
    hr: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'HR'
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'organisationModel'
    },
   
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
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
    // verification: { type: Boolean, required: true},
    // isAdmin: { type: Boolean, required: true, default: false },
}, {
    timestamps: true,
}, )


const inviteEmployeeModel = mongoose.model('inviteemployeeModel', inviteEmployeeSchema);
export default inviteEmployeeModel