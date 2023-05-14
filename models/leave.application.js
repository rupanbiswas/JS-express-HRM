import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const leaveApplicationSchema = mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'employeeModel',
    },
    organisaiton:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'organisationModel'
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date
    },
    reason: {
        type: String
    },
    count:{
        type: Number,
    },
    approved: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
}, )


const leaveApplication = mongoose.model('leaveApplication', leaveApplicationSchema);
export default leaveApplication