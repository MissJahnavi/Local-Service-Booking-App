const express = require('express');
const mongoose = require('mongoose');
const availability = require('../models/availability');
const Service = require('../models/service')
const Booking = require('../models/booking')
const User = require('../models/user')
const businessOnlyMiddleware = require('../middlewares/businessOnlyMiddleware');
const authMiddleware = require('../middlewares/auth');

const router = express.Router();

router.get('/my-services', authMiddleware, businessOnlyMiddleware, async (req, res) => {
    const services = await Service.find({ business: req.user._id })
    res.json(services)
})


router.post('/postServices', authMiddleware, businessOnlyMiddleware, async (req, res) => {
    try {
        const { serviceName, description, price, category, location ,imageURL} = req.body;


        if (!serviceName || !description || price == null) {
            return res.status(400).json({ error: 'serviceName, description, and price are required' });
        }

        const newService = new Service({
            serviceName,
            description,
            price,
            category,
            location,
            business: req.user._id,
            imageURL
        });

        const savedService = await newService.save();
        res.status(201).json({ message: 'Service added successfully', service: savedService });
    } catch (error) {
        console.error('Error adding service:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.patch('/service/:id',authMiddleware,businessOnlyMiddleware, async (req, res) => {
    try {
        const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.json(service)
    } catch (error) {
        console.error("Error updating service", error)
    }
})

router.delete('/delete-service/:id', authMiddleware, businessOnlyMiddleware, async (req, res) => {
    try {
        const serviceId = req.params.id;

        const service = await Service.findOne({
            _id: serviceId,
            business: req.user._id,
        });

        if (!service) {
            return res
                .status(404)
                .json({ message: 'Service not found or not owned by you' });
        }

        await Service.deleteOne({ _id: serviceId });

        return res.status(200).json({ message: 'Service deleted' });
    } catch (err) {
        console.error('Delete service error:', err);
        return res
            .status(500)
            .json({ message: 'Server error deleting service', error: err.message });
    }
}
);




//Calendar view
router.get('/calendar', authMiddleware, async (req, res) => {
    const { view, date } = req.query;

    const targetDate = new Date(date);
    let endDate;

    try {
        if (view == 'weekly') {
            endDate = new Date(targetDate);
            endDate.setDate(endDate.getDate() + 7)
        }
        else {
            endDate = new Date(targetDate);
            endDate.setDate(endDate.getDate() + 1)
        }

        const bookings = await Booking.find({
            business: req.user._id,
            bookingDate: { $gte: targetDate, $lt: endDate }
        }).populate('user service')

        res.json(bookings)

    } catch (error) {
        console.error(error)
    }

})

//Availability-Setting working days and holidays
router.post('/availability', authMiddleware, businessOnlyMiddleware, async (req, res) => {
    const { workingDays, holidays } = req.body
    try {
        const updated = await availability.findOneAndUpdate(
            { business: req.user._id },
            { workingDays, holidays },
            { upsert: true, new: true }

        )
        res.json(updated)
    } catch (error) {
        res.status(500).json({ message: 'Availability update failed', error: error.message });
    }
})

//Get current availability

router.get('/availability', authMiddleware, businessOnlyMiddleware, async (req, res) => {
    const available = await availability.findOne({ business: req.user._id })
    res.json(available);
})

//Accept,reject and view appointments

// router.get('/request', authMiddleware, businessOnlyMiddleware, async (req, res) => {
//     const request = await Booking.find({
//         business:req.user._id
//         // status: 'pending'
//     }).populate('user service')
//     res.json(request)
// })

router.get('/request', authMiddleware, businessOnlyMiddleware, async (req, res) => {
  try {
    const request = await Booking.find({ business: req.user._id })
      .populate({
        path: 'user',
        select: 'fullName email' 
      })
      .populate({
        path: 'service',
        select: 'serviceName'
      });

       res.json(request);
  } catch (err) {
    console.error("Error in /request:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.put('/requests/:id/accept', authMiddleware, businessOnlyMiddleware, async (req, res) => {
    const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: 'confirmed' },
        { new: true }
    )
    res.json({ message: "Booking confirmed", booking });
})

router.put('/requests/:id/reject', authMiddleware, businessOnlyMiddleware, async (req, res) => {
    const booking = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: 'cancelled' },
        { new: true }
    )
    res.json({ message: "Booking cancelled", booking });
})
module.exports = router;