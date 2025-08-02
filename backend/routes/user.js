const express = require('express');
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");
const User = require('../models/user')
const router = express.Router()
const mongoose = require('mongoose');

const secret = process.env.JWT_SECRET

router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User does not exist" });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: "Incorrect password" });
    }

    const token = jwt.sign({ _id: user._id, name: user.fullName, role: user.role, phone: user.phone, address: user.address }, secret, { expiresIn: '7h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV == "production",
      maxAge: 3600000 * 24
    })

    return res.status(200).json({ token, user: { fullName: user.fullName, email: user.email, role: user.role, phone: user.phone, address: user.address } });
  } catch (err) {
    console.error("Signin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
});



router.post('/signup', async (req, res) => {
  try {
    const { email, password, fullName, role, phone, address } = req.body;
    // console.log("Signup form data:", req.body);
    const userAlreadyExists = await User.findOne({ email });

    if (userAlreadyExists) {
      console.error(`user already exists`)
      res.status(400).json({ message: "user already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role,
      phone,
      address
    })

    // console.log('New user:', user)

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Server error" });
  }

})

router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false

  })
  return res.status(200).json({ message: "Logged out successfully" });
})

module.exports = router;

