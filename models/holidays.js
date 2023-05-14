import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const holidaySchema = mongoose.Schema({
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
    datas:Array
}, {
    timestamps: true,
}, )


const holiday = mongoose.model('holiday', holidaySchema);
export default holiday