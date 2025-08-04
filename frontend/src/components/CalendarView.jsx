import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';

const CalendarView = () => {
  const [bookings, setBookings] = useState([]);
  const [view, setView] = useState('weekly'); // or 'daily'
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]); // yyyy-mm-dd

  const fetchCalendar = async () => {
    try {
      const res = await api.get(`/businessDashboard/calendar`, {
        params: { view, date },
        withCredentials: true,
      });
      setBookings(res.data);
    } catch (error) {
      console.error('Calendar fetch error:', error);
    }
  };

  useEffect(() => {
    fetchCalendar();
  }, [view, date]);

  return (
    <div className="mt-6">
      <div className="flex items-center gap-4 mb-4">
        <label className="font-semibold">View:</label>
        <select
          value={view}
          onChange={(e) => setView(e.target.value)}
          className="border p-1 rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>

        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border p-1 rounded"
        />
      </div>

      <div className="space-y-4">
        {bookings.length === 0 ? (
          <p className="text-gray-500">No bookings in selected {view} view.</p>
        ) : (
          bookings.map((b) => (
            <div
              key={b._id}
              className="border p-4 bg-white shadow rounded-md"
            >
              <h3 className="font-semibold text-lg">{b.service?.serviceName || 'Service'}</h3>
              <p className="text-sm text-gray-600">
                Date: {new Date(b.bookingDate).toLocaleDateString()} | Time: {b.timeSlot}
              </p>
              <p className="text-sm text-gray-500">Customer: {b.user?.fullName}</p>
              <p className="text-sm text-gray-400">Status: {b.status}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CalendarView;