const mongoose = require('mongoose')
const { Schema } = require('mongoose');

const bookingSchema = new mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    service: {
        type: Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    bookingDate: {
        type: Date,
        required: true,
        default: Date.now()
    },
    timeSlot: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'failed'],
        default:'pending'
    },
    notes: {
        type: String
    },
    business: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    paymentId:{
        type:String
    },
    orderId:{
        type:String
    },
    paymentMethod:{ type:String},
    amountPaid:{type:Number},
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid', 'failed'],
        default: 'unpaid'
    },
}, { timestamps: true })


const Booking = mongoose.model('Booking', bookingSchema);

module.exports = Booking;