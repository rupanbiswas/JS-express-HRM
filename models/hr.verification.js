import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const hrVerificationSchema = mongoose.Schema({
    hr: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'HR'
    },
    email: {
        type: String,
        required: true,
        unique: true
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


const verify = mongoose.model('hrVerification', hrVerificationSchema);
export default verify