import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const allotedLeavesSchema = mongoose.Schema({
    hr: {
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'employeeModel',
    },
    organisation: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'organisationModel',
        unique: true

    },
    leaves:Array,
}, {
    timestamps: true,
}, )


const allotedLeaves = mongoose.model('allotedLeaves', allotedLeavesSchema);
export default allotedLeaves