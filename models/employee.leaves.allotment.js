import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeLeaveAllotmentSchema = mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'employeeModel',
        unique: true,
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'organisationModel'
    },
    allotedLeaves: Array,
    leavesTaken: Array
}, {
    timestamps: true,
}, )


const employeeLeaveAllotment = mongoose.model('employeeLeaveallotment', employeeLeaveAllotmentSchema);
export default employeeLeaveAllotment