import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeAttendenceSchema = mongoose.Schema({
    employee: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'employeeModel'
    },
    organisation:{
        type: mongoose.Schema.Types.ObjectId,
        // required: true,
        ref: 'organisationModel'
    },
    created_by: {
        _id:String,
        position:String
    },
    month: {
        type: Number,
        required: true
    },
    year: {
        type: Number,
        required: true,
        unique: true
    },
    checkin_attendence: [{
        date: String,
        time :String
    }
    ],
    checkout_attendence: [{
        date: String,
        time :String
    }
    ],
    status: {
        type: Boolean,
    }
}, {
    timestamps: true,
}, )


const employeeAttendence = mongoose.model('employeeAttendence', employeeAttendenceSchema);
export default employeeAttendence