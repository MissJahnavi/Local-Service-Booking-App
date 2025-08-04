const express = require('express');
const mongoose = require('mongoose');
const authMiddleware = require('../middlewares/auth');
const Service = require('../models/service')
const Booking = require('../models/booking')
const User = require('../models/user')

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

//Booking by user
router.post('/book', authMiddleware, async (req, res) => {
    const { serviceName, bookingDate, timeSlot, notes } = req.body;
    console.log(req.body);
    try {
        const foundService= await Service.findOne({ serviceName:serviceName}).populate('business') ;
        // console.log('foundservice:',foundService)
        if (!foundService) {
            return res.status(404).json({ message: 'Service not found' });
        }
      console.log("Business ID:", foundService.business);

        const booking = await Booking.create({
            user: req.user._id,
            service:foundService._id,
            business: foundService.business._id,
            bookingDate,
            timeSlot,
            notes
        })
        const newBooking=await Booking.findById(booking._id).populate('service','serviceName').populate('user','fullName')
        return res.status(201).json({ message: "Booking successful", newBooking })
    } catch (error) {
        console.error('Booking error:', error);
        res.status(500).json({ message: 'Booking failed' });
    }
})

//Viewing the booked services
router.get('/booked-Services',authMiddleware,async (req,res) => {
    try {
        const userId=req.user._id;
        // console.log("Booking user:", req.user._id);


        const bookings=await Booking.find({user:userId}).populate('service','serviceName')
        
        return res.status(200).json({bookings})
    } catch (error) {
        console.log("error fetching bookings",error);
        return res.status(500).json({message:"Internal server error"})
    }
})


module.exports = router;