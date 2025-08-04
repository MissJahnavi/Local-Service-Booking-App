import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import axios from 'axios';
import api from '../api';


export default function Home() {
  const [servicesData, setservicesData] = useState([]);
  const [loading, setloading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/ser/getServices', {
          withCredentials: true,
        });
        setservicesData(res.data);
        setloading(false);
      } catch (error) {
        console.error('Failed to load services', error);
        setloading(false);
      }
    };
    fetchServices();
  }, []);

  const filteredServices = servicesData.filter((service) => {
    const matchesSearch = service.serviceName.toLowerCase().includes(search.toLowerCase());
    // const matchesCategory =
    //   selectedCategory === '' || service.category === selectedCategory;
    return matchesSearch;
  });

  const BASE_URL="http://localhost:5000"
  return (
    <div className="w-full min-h-screen bg-gray-50 text-gray-800">

      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-white via-blue-50 to-blue-100 py-20">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-6 text-gray-800 leading-tight">
            Book Trusted Local Services Near You
          </h1>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Hassle-free home services from verified professionals — anytime, anywhere.
          </p>

          <div className="max-w-xl mx-auto relative">
            <input
              type="text"
              placeholder="Search for services e.g. electrician, cleaning..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 p-4 rounded-full shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            <button className="absolute right-2 top-2 bottom-2 px-6 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition">
              Search
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold mb-10 text-center text-gray-800">Popular Categories</h2>

          {/* <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"> */}
          <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">

            {filteredServices.map((service, index) => (
              <div key={index} className="bg-white border hover:border-blue-500 p-4 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 text-center group">
                <img
                  src={`${BASE_URL}/images/${service.serviceName.toLowerCase()}.jpg`}

                  alt={service.serviceName}
                  className="w-full h-40 object-cover rounded-md mb-3"
                />
                <h3 className="text-lg font-semibold mb-1">{service.serviceName}</h3>
                <p className="text-sm text-gray-600 mb-3">{service.description}</p>

              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-indigo-600 to-indigo-700 text-white text-center">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4">Are You a Service Provider?</h2>
        <p className="mb-6 text-lg">Join our platform to reach new customers and grow your business.</p>
        <Link
          to="/business/register"
          className="inline-block bg-white text-indigo-700 font-semibold px-8 py-3 rounded-full shadow-lg hover:bg-gray-100 transition"
        >
          Register Your Service
        </Link>
      </section>

      {/* Footer */}
      <footer className="bg-gray-100 text-center py-6 text-sm text-gray-500 mt-10">
        © {new Date().getFullYear()} LocalServices · All rights reserved.
      </footer>
    </div>
  );
}
