// import React, { useEffect, useState } from 'react';
// import axios from 'axios';

// const UserBookingsTab = () => {
//     const [bookings, setBookings] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchBookings = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 const res = await axios.get('http://localhost:5000/services/booked-Services', {
//                     withCredentials: true
//                 });
//                 setBookings(res.data.bookings);
//             } catch (err) {
//                 console.error('Error fetching bookings', err);
//             } finally {
//                 setLoading(false);
//             }
//         };

//         fetchBookings();
//     }, []);

//     const cancelBooking = async (bookingId) => {
//         try {
//             const token = localStorage.getItem('token');
//             const res = await axios.delete(`http://localhost:5000/userDashboard/booking/${bookingId}`, { withCredentials: true })
//             setBookings(prev => prev.filter(b => b._id != bookingId))
//         } catch (error) {

//         }
//     }

//     if (loading) return <p>Loading your bookings...</p>;

//     if (bookings.length === 0) return <p>No bookings yet.</p>;

//     return (
//         <div className="space-y-4">
//             {bookings.map((booking, idx) => (
//                 <div key={idx} className="border rounded p-4 shadow">
//                     <p><strong>Service:</strong> {booking.service.serviceName}</p>
//                     <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
//                     <p><strong>Time:</strong> {booking.timeSlot}</p>
//                     <p><strong>Status:</strong> {booking.status || 'Confirmed'}</p>
//                 </div>
//             ))}
//         </div>
//     );
// };

// export default UserBookingsTab;


import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserBookingsTab = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/services/booked-Services', {
        withCredentials: true
      });
      setBookings(res.data.bookings);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const cancelBooking = async (bookingId) => {
    const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
    if (!confirmCancel) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/userDashboard/booking/${bookingId}`, {
        withCredentials: true
      });

      // Remove from UI
      setBookings(prev => prev.filter(b => b._id !== bookingId));
      alert('Booking cancelled!');
    } catch (err) {
      console.error('Error cancelling booking', err);
      alert('Failed to cancel booking');
    }
  };

  if (loading) return <p>Loading your bookings...</p>;

  if (bookings.length === 0) return <p>No bookings yet.</p>;

  return (
    <div className="space-y-4">
      {bookings.map((booking, idx) => (
        <div key={idx} className="border rounded p-4 shadow space-y-1">
          <p><strong>Service:</strong> {booking.service.serviceName}</p>
          <p><strong>Date:</strong> {new Date(booking.bookingDate).toLocaleDateString()}</p>
          <p><strong>Time:</strong> {booking.timeSlot}</p>
          <p><strong>Status:</strong> {booking.status || 'Confirmed'}</p>

          <button
            onClick={() => cancelBooking(booking._id)}
            className="mt-2 px-3 py-1 text-sm text-white bg-red-500 hover:bg-red-600 rounded"
          >
            Cancel Booking
          </button>
        </div>
      ))}
    </div>
  );
};

export default UserBookingsTab;
