const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/auth');
const Service = require('../models/service')
const Booking = require('../models/booking')
const User = require('../models/user')
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");


const router = express.Router();

router.get('/getServices', async (req, res) => {

    try {
        const services = await Service.find();
        return res.status(200).json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

//Route to view the past and upcoming bookings in the dashboard
router.get('/getBookings', authMiddleware, async (req, res) => {
    try {
        const userId = req.user._id;

        const now = new Date();

        const upcoming = await Booking.find({
            user: userId,
            bookingDate: { $gte: now }
        }).populate('service').sort({ bookingDate: 1 })


        const past = await Booking.find({
            user: userId,
            bookingDate: { $lt: now }
        }).populate('service').sort({ bookingDate: -1 })

        res.json({ upcoming, past });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }

})


//Cancel the booking
router.delete('/booking/:id', authMiddleware, async (req, res) => {
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id });
        if (!booking) {
            res.status(404).json({ message: "Booking not found" })
        }
        await booking.deleteOne();
        res.json({ message: 'Booking cancelled' });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling booking", error: error.message })
    }

})

//Reschedule the booking 
router.put('/booking/:id', authMiddleware, async (req, res) => {
    const { newBookingDate, newTimeSlot } = req.body;
    try {
        const booking = await Booking.findOne({ _id: req.params.id, user: req.user._id })
        if (!booking) {
            res.status(404).json({ message: "Booking not found" })
        }
        booking.bookingDate = newBookingDate;
        booking.timeSlot = newTimeSlot;

        await booking.save();

        return res.json({ message: "Booking rescheduled", booking })
    } catch (error) {
        res.status(500).json({ message: "Error rescheduling booking", error: error.message })
    }

})


router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json(user);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/profile', authMiddleware, async (req, res) => {
    const { email, fullName, password, phone, address } = req.body;
    try {
        const updates = {};
        if (email) { updates.email = email };
        if (fullName) { updates.fullName = fullName };
        if (phone) { updates.phone = phone };
        if (address) { updates.address = address };

        if (password) {
            const hashedPassword = await bcrypt.hash(password, 12);
            updates.password = hashedPassword;
        }

        const updatedUser = await User.findByIdAndUpdate(req.user._id, updates, { new: true })
        res.json({ message: 'Profile updated', user: updatedUser });
    } catch (error) {
        res.status(500).json({ message: 'Update failed', error: error.message });
    }
})


module.exports = router;