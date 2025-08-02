require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require("cookie-parser");
const User = require('./models/user')
const userRoute = require('./routes/user')
const serviceRoute = require('./routes/bookService')
const getServiceRoute = require('./routes/service')
const userDashboardRoute = require('./routes/userDashboard')
const businessDashboardRoute = require('./routes/businessDashboard')
const adminRoute = require('./routes/admin')
const adminOnlyMiddleware = require('./middlewares/admin')
const businessOnlyMiddleware = require('./middlewares/businessOnlyMiddleware')
const authMiddleware = require('./middlewares/auth')
const cors = require('cors');
const PORT = process.env.PORT
const app = express();

app.use('/images', express.static('public/images'));

app.use(cookieParser())
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));


mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected"))

app.use(express.urlencoded({ extended: false }))
app.use(express.json())


app.use('/user', userRoute)
app.use('/', getServiceRoute)
app.use('/services', authMiddleware, serviceRoute);
app.use('/userDashboard', authMiddleware, userDashboardRoute);
app.use('/businessDashboard', businessDashboardRoute)
app.use('/admin', authMiddleware, adminOnlyMiddleware, adminRoute)

// app.use('/', postServiceRoute)

app.listen(PORT, () => console.log(`Server running on port ${PORT}`))