require('dotenv').config();
const express = require('express')
const Booking = require('../models/booking')
const Service = require('../models/service')
const User = require('../models/user')
const razorpay = require('../utils/razorpay')
const authMiddleware = require('../middlewares/auth')

const router = express.Router();

//RazorPay order
router.post('/create-order', authMiddleware, async (req, res) => {
    const { bookingId } = req.body;

    try {
        const booking = await Booking.findById(bookingId).populate('service')
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        const amount = booking.service.price * 100

        const order = await razorpay.orders.create({
            amount,
            cuurency: 'INR',
            receipt: `receipt_${bookingId}`,
            notes: {
                bookingId: bookingId,
                userId: req.user._id.toString()
            }
        })

        booking.orderId = order.id;
        booking.amountPaid = order.amount;

        await booking.save();

        return res.status(200).json({
            key: process.env.RAZORPAY_KEY_ID,
            amount: order.amount,
            orderId: order.id,
            currency: order.currency,
            bookingId

        })
    } catch (error) {
        console.error("Create order error:", error);
        res.status(500).json({ message: "Internal server error" });
    }

})

//Accepting order
router.post('/success', authMiddleware, async (req, res) => {
    const { bookingId, paymentId, paymentMethod } = req.body;
    try {
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }

        booking.paymentId = paymentId;
        booking.paymentMethod = paymentMethod;
        booking.status = 'confirmed';
        booking.paymentStatus = 'paid';

        await booking.save();

        res.status(200).json({
            message: 'Payment successful,Booking confirmed',
            booking
        })

    } catch (error) {
        console.error("Payment success error:", error);
        res.status(500).json({ message: "Internal server error" });
    }

})

//failure
router.post('/failure', authMiddleware, async (req, res) => {
    const { bookingId } = req.body;

    try {
        const booking = await Booking.findById(bookingId)
        if (!booking) {
            return res.status(404).json({ message: 'Booking not found' });
        }


        booking.status = 'cancelled';
        booking.paymentStatus = 'unpaid';

        await booking.save();

        res.status(200).json({
            message: 'Payment failed. Please retry.',
            booking
        })
    } catch (error) {
        console.error("Payment failure error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

)
module.exports = router;
