const express = require('express');
const mongoose = require('mongoose');
const availability = require('../models/availability');
const Service = require('../models/service')
const Booking = require('../models/booking')
const User = require('../models/user')
const authMiddleware=require('../middlewares/auth')
const adminOnlyMiddleware = require('../middlewares/admin')

const router = express.Router();

//User management
router.get('/users', async (req, res) => {
    const user = await User.find();
    res.json(user);

})

router.patch('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(user)
    } catch (error) {
        console.error("Error updating user", error)
    }
})

router.delete('/user/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id)
        res.json({ message: 'User deleted' });
    } catch (error) {
        console.error("Error deleting user", error)
    }
})

//Service Management
router.get('/service', async (req, res) => {
    const service = await Service.find()
    
    res.json(service)
})
router.patch('/service/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(service)
    } catch (error) {
        console.error("Error updating service", error)
    }
})

router.delete('/service/:id', async (req, res) => {
    try {
        const service = await Service.findByIdAndDelete(req.params.id)
        res.json({ message: 'Service deleted' });
    } catch (error) {
        console.error("Error deleting service", error)
    }
})

//Booking mamangement
router.get('/bookings', async (req, res) => {
    const booking = await Booking.find().populate('user', 'fullName email').populate('service', 'serviceName')
    res.json(booking)
})

//Dashboard summary
router.get('/report/summary', async (req, res) => {
    const userCount = await User.countDocuments();
    const bookingCount = await Booking.countDocuments();
    const businessCount = await Booking.countDocuments({ role: 'business' });
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const revenueToday = await Booking.aggregate([
        { $match: { createdAt: { $gte: today } } },
        { $group: { _id: null, total: { $sum: '$amountPaid' } } }
    ])
    res.json({
        users: userCount,
        businesses: businessCount,
        bookings: bookingCount,
        revenueToday: revenueToday[0]?.total || 0,
    });
})

//Monthy stats
router.get('/report/monthly', async (req, res) => {
    const year = req.query.year || new Date().getFullYear();
    const bookings = await Booking.aggregate([
        { $match: { bookingDate: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
        { $group: { _id: { $month: '$bookingDate' }, count: { $sum: 1 } } }
    ])

    const payments = await Booking.aggregate([
        { $match: { bookingDate: { $gte: new Date(`${year}-01-01`), $lt: new Date(`${year + 1}-01-01`) } } },
        { $group: { _id: { $month: '$bookingDate' }, total: { $sum: '$amountPaid' } } }
    ])

    const result = Array.from({ length: 12 }, (_, i) => ({
        month: i + 1,
        bookings: bookings.find(b => b._id === i + 1)?.count || 0,
        revenue: payments.find(p => p._id === i + 1)?.total || 0
    }))
    res.json({
        result
    })
})
module.exports = router;