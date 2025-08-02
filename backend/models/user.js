const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user', 'business', 'admin'],
        default: 'user',
        required: true
    },
    phone: {
        type: Number,
        required:true
    },
    address:{
        type:String,
        required:true
    }

}, { timestamps: true }
)
const User = mongoose.model('User', userSchema);
module.exports = User