import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const HRSchema = mongoose.Schema({
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
        required: true,
        unique: true
    },
    gender: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    verified: {
        type: Boolean,
        required: true,
        default: false
    },
    phoneNumber: {
        type: Number,
        required: true,
        length: 10
    },
    HR: {
        type: Boolean,
        required: true,
        default: false
    },
}, {
    timestamps: true,
})


HRSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


HRSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    console.log(this.password)
})

const HR = mongoose.model('HR', HRSchema);

export default HR;