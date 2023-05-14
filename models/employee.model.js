import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const employeeSchema = mongoose.Schema({
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
        required: true,
        unique: true
    },
    position: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        length: 10
    },
    password: {
        type: String,
        required: true
    },
    HR:{
        type:Boolean, 
        required: true,
        default: false
    },
    leaves_taken:[
        {reason:String,
         number:Number} 
     ],
     leaves_alloted:[
        {reason:String,
         number:Number} 
     ]

}, {
    timestamps: true,
}, )


employeeSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


employeeSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next()
    }

    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    console.log(this.password)
})

const employeeModel = mongoose.model('employeeModel', employeeSchema);

export default employeeModel;