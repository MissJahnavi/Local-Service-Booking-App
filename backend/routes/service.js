const express = require('express');
const router = express.Router();
const Service = require('../models/service');
const authMiddleware = require('../middlewares/auth')



router.get('/getServices', async (req, res) => {

    try {
        const services = await Service.find();
        return res.status(200).json(services);
    } catch (error) {
        console.error('Error fetching services:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
})

module.exports = router;
