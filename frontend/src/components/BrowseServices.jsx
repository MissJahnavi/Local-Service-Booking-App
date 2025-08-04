import React, { useState, useEffect } from 'react';
import DatePicker from 'react-multi-date-picker';
import axios from 'axios';
import api from '../api';
// import { BASE_URL } from '../api';

const BrowseServices = () => {
  const [search, setSearch] = useState('');
  const [servicesData, setservicesData] = useState([]);
  const [loading, setloading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState({});
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get('/userDashboard/getServices', {
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
    const matchesCategory =
      selectedCategory === '' || service.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleBook = async (serviceName) => {
    const selectedService = bookingDetails[serviceName];
    if (!selectedService?.date || !selectedService?.time) {
      alert('Please select both a date and time slot.');
      return;
    }

    try {
      const res = await api.post(
        '/services/book',
        {
          serviceName,
          bookingDate: selectedService.date,
          timeSlot: selectedService.time,
          notes: '',
        },
        {
          withCredentials: true, 
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Booking successful!');
    } catch (err) {
      console.error('Booking error', err);
      const message = err.response?.data?.message || 'An error occurred during booking.';
      alert('Booking failed: ' + message);
    }
  };

  const handleDateChange = (serviceName, date) => {
    setBookingDetails((prev) => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        date: date,
      },
    }));
  };

  const handleTimeChange = (serviceName, time) => {
    setBookingDetails((prev) => ({
      ...prev,
      [serviceName]: {
        ...prev[serviceName],
        time: time,
      },
    }));
  };

  const BASE_URL="http://localhost:5000"

  const getImagePath = (serviceName) => {
    return `${BASE_URL}/images/${serviceName.toLowerCase()}.jpg`;
  };

  return (
    <div className="flex px-6 py-10 bg-gray-50 min-h-screen">
      {/* Filter Sidebar */}
      <div className="w-1/4 pr-6">
        <h1 className="text-2xl font-semibold mb-6">Browse Services</h1>

        <input
          type="text"
          placeholder="Search"
          className="w-full p-2 border border-gray-300 rounded mb-6"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div>
          <label className="block mb-1 font-medium">Category</label>
          <select
            className="w-full p-2 border border-gray-300 rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <option value="">All</option>
            <option value="Home">Home</option>
            <option value="Beauty">Beauty</option>
            <option value="Repair">Repair</option>
          </select>
        </div>
      </div>

      {/* Service Cards */}
      <div className="w-3/4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredServices.map((service, index) => (
          <div key={index} className="bg-white rounded-lg shadow p-4">
            <img
              src={getImagePath(service.serviceName)}
              alt={service.serviceName}
              className="w-full h-40 object-cover rounded-md mb-3"
            />
            <h3 className="text-lg font-semibold mb-1">{service.serviceName}</h3>
            <p className="text-sm text-gray-600 mb-3">{service.description}</p>

            <input
              type="date"
              className="w-full border border-gray-300 p-2 rounded mb-2"
              value={bookingDetails[service.serviceName]?.date || ''}
              onChange={(e) =>
                handleDateChange(service.serviceName, e.target.value)
              }
            />

            <select
              className="w-full border border-gray-300 p-2 rounded mb-3"
              value={bookingDetails[service.serviceName]?.time || ''}
              onChange={(e) =>
                handleTimeChange(service.serviceName, e.target.value)
              }
            >
              <option value="">Select Time</option>
              <option>09:00 AM</option>
              <option>10:00 AM</option>
              <option>11:00 AM</option>
              <option>01:00 PM</option>
              <option>03:00 PM</option>
              <option>05:00 PM</option>
            </select>

            <button
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              onClick={() => handleBook(service.serviceName)}
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BrowseServices;
