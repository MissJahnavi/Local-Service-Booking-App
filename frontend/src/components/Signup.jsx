import React from 'react'
import { Link } from "react-router-dom";
import axios from 'axios';
import api from '../api';
import { useState } from 'react';

const Signup = () => {
    const [formData, setformData] = useState({ fullName: '', email: '', password: '', phone: '', address: '', role: '' })

    const handleChange = (e) => {
        const { name, value } = e.target;
        setformData({ ...formData, [name]: value });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/user/signup', formData)
            alert("Signup successfull")
            window.location.href = '/';
        } catch (error) {
            console.error(error.response?.data?.message || error.message)
            alert('Signup failed');
        }
    }
    return (
        <div>
            <section className="py-10 bg-gray-50 sm:py-16 lg:py-24">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold leading-tight text-black sm:text-4xl lg:text-5xl">Create free account</h2>
                    </div>

                    <div className="relative max-w-md mx-auto mt-8 md:mt-16">
                        <div className="overflow-hidden bg-white rounded-md shadow-md">
                            <div className="px-4 py-6 sm:px-8 sm:py-7">
                                <form onSubmit={handleSignup} >
                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="" className="text-base font-medium text-gray-900"> First & Last name </label>
                                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                    </svg>
                                                </div>

                                                <input
                                                    type="text"
                                                    name="fullname"
                                                    id="fullname"
                                                    placeholder="Enter your full name"
                                                    onChange={e => setformData({ ...formData, fullName: e.target.value })}
                                                    className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="" className="text-base font-medium text-gray-900"> Email address </label>
                                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                                    </svg>
                                                </div>

                                                <input
                                                    type="email"
                                                    name="email"
                                                    id="email"
                                                    placeholder="Enter email to get started"
                                                    onChange={e => setformData({ ...formData, email: e.target.value })}
                                                    className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="" className="text-base font-medium text-gray-900"> Password </label>
                                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">
                                                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth="2"
                                                            d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
                                                        />
                                                    </svg>
                                                </div>

                                                <input
                                                    type="password"
                                                    name="password"
                                                    id="password"
                                                    placeholder="Enter your password"
                                                    onChange={e => setformData({ ...formData, password: e.target.value })}
                                                    className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                                />
                                            </div>
                                        </div>


                                        <div>
                                            <label htmlFor="phone" className="text-base font-medium text-gray-900"> Phone Number </label>
                                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">

                                                <input
                                                    type="tel"
                                                    name="phone"
                                                    id="phone"
                                                    placeholder="Enter your phone number"
                                                    onChange={e => setformData({ ...formData, phone: e.target.value })}
                                                    className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <label htmlFor="" className="text-base font-medium text-gray-900"> Address </label>
                                            <div className="mt-2.5 relative text-gray-400 focus-within:text-gray-600">

                                                <input
                                                    type="text"
                                                    name="address"
                                                    id="address"
                                                    placeholder="Enter your Address"
                                                    onChange={e => setformData({ ...formData, address: e.target.value })}
                                                    className="block w-full py-4 pl-10 pr-4 text-black placeholder-gray-500 transition-all duration-200 bg-white border border-gray-200 rounded-md focus:outline-none focus:border-blue-600 caret-blue-600"
                                                />
                                            </div>
                                        </div>


                                        <div>
                                            <label className="block font-medium mb-2">What is your role?</label>
                                            <div className="flex gap-6">
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        value="user"
                                                        checked={formData.role === 'user'}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                    User
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        value="business"
                                                        checked={formData.role === 'business'}
                                                        onChange={handleChange}
                                                    />
                                                    Business
                                                </label>
                                                <label className="flex items-center gap-2">
                                                    <input
                                                        type="radio"
                                                        name="role"
                                                        value="admin"
                                                        checked={formData.role === 'admin'}
                                                        onChange={handleChange}
                                                    />
                                                    Admin
                                                </label>
                                            </div>
                                        </div>

                                        {/* <div className="flex items-center">
                                            <input type="checkbox" name="agree" id="agree" className="w-5 h-5 text-green-500 bg-white border-gray-200 rounded" defaultChecked />

                                            <label htmlFor="agree" className="ml-3 text-sm font-medium text-gray-500">
                                                I agree to Postcraft’s <a href="#" title="" className="text-blue-600 hover:text-blue-700 hover:underline">Terms of Service</a> and <a href="#" title="" className="text-blue-600 hover:text-blue-700 hover:underline">Privacy Policy</a>
                                            </label>
                                        </div> */}

                                        <div>
                                            <button type="submit" className="inline-flex items-center justify-center w-full px-4 py-4 text-base font-semibold text-white transition-all duration-200 bg-blue-600 border border-transparent rounded-md focus:outline-none hover:bg-blue-700 focus:bg-blue-700">
                                                Create account
                                            </button>
                                        </div>

                                        <div className="text-center">
                                            <p className="text-base text-gray-600">
                                                Already have an account?{" "}
                                                <Link to="/signin" className="font-medium text-orange-500 transition-all duration-200 hover:text-orange-600 hover:underline">
                                                    Login here
                                                </Link>
                                            </p>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Signup
