import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const organisationSchema = mongoose.Schema({

    organisationName: {
        type: String,
        required: true,
    },
    verified: {
        type: Boolean,
        default: false
    },
    websiteURL: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    address: {
        type: String,
        required: true
    },
    numberOfEmployees: {
        type: Number,
        required: true
    },
    subscriptions: {
        type: String,
        deault: 'silver'
    },
    logo: Object,
}, {
    timestamps: true,
})

const organisationModel = mongoose.model('organisationModel', organisationSchema)

export default organisationModel;