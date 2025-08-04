import React, { useState, useEffect } from 'react';
import axios from 'axios';
import api from '../api';
import DatePicker from 'react-multi-date-picker'


const UserDashboard = () => {
    const [activeTab, setActiveTab] = useState('bookings');
    const [showPast, setShowPast] = useState(false);
    const [bookings, setbookings] = useState({ upcoming: [], past: [] })
    const [bookingDetails, setBookingDetails] = useState([])
    const [loading, setloading] = useState(true)
    const [user, setuser] = useState({ email: '', fullName: '', phone: '', address: '' })
    const [showRescheduleForm, setShowRescheduleForm] = useState(false);
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [newDate, setNewDate] = useState(new Date());
    const [newTime, setNewTime] = useState('');
    const [isEditingProfile, setIsEditingProfile] = useState(false);


    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const res = await api.get('/userDashboard/getBookings', { withCredentials: true });
                setbookings({
                    upcoming: res.data.upcoming || [],
                    past: res.data.past || []
                });
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setloading(false);
            }
        };

        fetchBookings();
    }, []);

    const upcomingAppointments = bookings.upcoming;
    const pastAppointments = bookings.past;



    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.get('/userDashboard/profile', {
                    withCredentials: true
                })
                setuser(res.data)
            } catch (error) {
                console.error("Error fetching user profile:", error);
            }

        }
        fetchUser()
    }, [])


    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.put(
                '/userDashboard/profile',
                {
                    email: user.email,
                    phone: user.phone,
                    fullName: user.fullName,
                    password: user.password,
                    address: user.address
                },
                { withCredentials: true }
            );
            alert('Profile updated successfully!');
            setuser(res.data.user);
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Failed to update profile');
        }
    };


    const handleReschedule = async (booking) => {
        const token = localStorage.getItem('token');
        try {
            if (!booking || !booking._id) {
                console.error("Invalid booking:", booking);
                return;
            }

            const jsDate = newDate?.toDate?.() || newDate;
            const isoDate = jsDate.toISOString().split("T")[0];

            const res = await api.put(`/userDashboard/booking/${booking._id}`, {
                serviceName: booking.service.serviceName,
                newBookingDate: isoDate,
                newTimeSlot: newTime,
                notes: booking.notes || '',
            }, { withCredentials: true });

            const updatedBooking = res.data.booking;
            setbookings(prev => ({
                ...prev,
                upcoming: prev.upcoming.map(b =>
                    b._id === updatedBooking._id ? updatedBooking : b
                )
            }));

            setShowRescheduleForm(false);
            alert('Rescheduled successfully!');
            // window.href = '/userDashboard'
            const refreshed = await api.get('/userDashboard/getBookings', {
                withCredentials: true
            });
            setbookings({
                upcoming: refreshed.data.upcoming || [],
                past: refreshed.data.past || []
            });
        } catch (err) {
            console.error('Error rescheduling date', err);
            alert('Failed to reschedule the booking');
        }
    };

    const cancelBooking = async (bookingId) => {
        const confirmCancel = window.confirm("Are you sure you want to cancel this booking?");
        if (!confirmCancel) return;
        try {
            const token = localStorage.getItem('token');
            await api.delete(`/userDashboard/booking/${bookingId}`, {
                withCredentials: true
            });

            // Remove from UI
            setBookingDetails(prev => prev.filter(b => b._id !== bookingId));
            alert('Booking cancelled!');
        } catch (err) {
            console.error('Error cancelling booking', err);
            alert('Failed to cancel booking');
        }
    };

    if (loading) return <p>Loading your bookings...</p>;
    if (bookings.length === 0) return <p>No bookings yet.</p>;

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/user/logout', {}, { withCredentials: true });
            alert('Logged out successfully!');
        } catch (error) {
            console.error('Error logging out', error);
            alert('Failed to logout');
        } finally {
           
            localStorage.clear();
            sessionStorage.clear();
            window.location.href = '/'
        }
    }


    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md">
                <div className="p-6 text-xl font-bold border-b">Dashboard</div>
                <nav className="flex flex-col p-4 gap-4">
                    <button onClick={() => setActiveTab('bookings')} className="text-left hover:font-semibold">
                        My Bookings
                    </button>
                    <button onClick={() => setActiveTab('profile')} className="text-left hover:font-semibold">
                        Profile
                    </button>
                    <button onClick={handleLogout} className="text-left text-red-600 hover:font-semibold">Logout</button>
                </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {activeTab === 'bookings' && (
                    <>
                        <h2 className="text-2xl font-semibold mb-4">Upcoming Appointments</h2>
                        <div className="space-y-4">
                            {upcomingAppointments.map(app => (
                                <div key={app._id} className="p-4 bg-white shadow rounded-md flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{app.service?.serviceName}</h3>
                                        <p>{new Date(app.bookingDate).toLocaleDateString()} at {app.timeSlot}</p>
                                        <p className="text-sm text-gray-500">Status: {app.status}</p>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="px-3 py-1 bg-yellow-500 text-white rounded"
                                            onClick={() => {
                                                setSelectedBooking(app);
                                                setNewDate(new Date(app.bookingDate)); // set YYYY-MM-DD
                                                setNewTime(app.timeSlot);
                                                setShowRescheduleForm(true);
                                            }}>Reschedule</button>
                                        <button className="px-3 py-1 bg-red-500 text-white rounded" onClick={() => cancelBooking(app._id)} >Cancel</button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-6">
                            <button onClick={() => setShowPast(!showPast)} className="text-blue-600">
                                {showPast ? 'Hide Past Appointments' : 'Show Past Appointments'}
                            </button>

                            {showPast && (
                                <div className="mt-4 space-y-4">
                                    {pastAppointments.map(app => (
                                        <div key={app._id} className="p-4 bg-gray-100 rounded">
                                            <h3 className="font-semibold">{app.service?.serviceName}</h3>
                                            <p>{new Date(app.bookingDate).toLocaleDateString()} at {app.time}</p>
                                            <p className="text-sm text-gray-500">Status: {app.status}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}


                {activeTab === 'profile' && (
                    <div className="max-w-md">
                        {!isEditingProfile ? (

                            <div className="max-w-md mx-auto bg-white shadow-lg rounded-xl p-6 space-y-6">
                                <div className="flex items-center space-x-4">
                                    <div className="w-16 h-16 bg-blue-100 text-blue-700 flex items-center justify-center rounded-full text-xl font-semibold uppercase">
                                        {user?.fullName?.charAt(0) || 'U'}
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800">My Profile</h2>
                                        <p className="text-sm text-gray-500">Welcome back, {user?.fullName?.split(' ')[0] || 'User'}!</p>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 pt-4 space-y-3">
                                    <p className="text-gray-700"><span className="font-medium text-gray-900">Email:</span> {user?.email}</p>
                                    <p className="text-gray-700"><span className="font-medium text-gray-900">Full Name:</span> {user?.fullName}</p>
                                    <p className="text-gray-700"><span className="font-medium text-gray-900">Phone:</span> {user?.phone}</p>
                                    <p className="text-gray-700"><span className="font-medium text-gray-900">Address:</span> {user?.address}</p>
                                </div>

                                <div className="pt-4">
                                    <button
                                        onClick={() => setIsEditingProfile(true)}
                                        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md transition duration-200"
                                    >
                                        Edit Profile
                                    </button>
                                </div>
                            </div>
                        ) : (
                            
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Edit Profile</h2>
                                <form onSubmit={(e) => {
                                    handleProfileSubmit(e);
                                    setIsEditingProfile(false);
                                }} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium">Email</label>
                                        <input
                                            type="email"
                                            value={user?.email || ''}
                                            onChange={(e) => setuser({ ...user, email: e.target.value })}
                                            className="w-full mt-1 p-2 border rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium">Full Name</label>
                                        <input
                                            type="text"
                                            value={user?.fullName || ''}
                                            onChange={(e) => setuser({ ...user, fullName: e.target.value })}
                                            className="w-full mt-1 p-2 border rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium">New Password</label>
                                        <input
                                            type="password"
                                            value={user.password || ''}
                                            onChange={(e) => setuser({ ...user, password: e.target.value })}
                                            className="w-full mt-1 p-2 border rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium">Phone</label>
                                        <input
                                            type="text"
                                            value={user?.phone || ''}
                                            onChange={(e) => setuser({ ...user, phone: e.target.value })}
                                            className="w-full mt-1 p-2 border rounded"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium">Address</label>
                                        <input
                                            type="text"
                                            value={user?.address || ''}
                                            onChange={(e) => setuser({ ...user, address: e.target.value })}
                                            className="w-full mt-1 p-2 border rounded"
                                        />
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditingProfile(false)}
                                            className="px-4 py-2 bg-gray-300 rounded"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}
                    </div>
                )}


                {showRescheduleForm && selectedBooking && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-30 z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                            <h3 className="text-lg font-bold mb-4">Reschedule Booking</h3>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Select New Date</label>
                                <DatePicker
                                    value={newDate}
                                    onChange={setNewDate}
                                    format="YYYY-MM-DD"
                                    minDate={new Date()}
                                    className="border rounded px-3 py-2 w-full"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">Select New Time Slot</label>
                                {/* <input
                                    type="time"
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                    className="w-full border px-3 py-2 rounded"
                                /> */}
                                <select
                                    className="w-full border border-gray-300 p-2 rounded mb-3"
                                    // value={bookingDetails[service.serviceName]?.time || ''}
                                    value={newTime}
                                    onChange={(e) => setNewTime(e.target.value)}
                                >
                                    <option value="">Select Time</option>
                                    <option>09:00 AM</option>
                                    <option>10:00 AM</option>
                                    <option>11:00 AM</option>
                                    <option>01:00 PM</option>
                                    <option>03:00 PM</option>
                                    <option>05:00 PM</option>
                                </select>

                            </div>

                            <div className="flex justify-end gap-3">
                                <button
                                    className="px-4 py-2 bg-gray-300 rounded"
                                    onClick={() => setShowRescheduleForm(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="px-4 py-2 bg-blue-600 text-white rounded"
                                    onClick={() => handleReschedule(selectedBooking)}
                                >
                                    Confirm
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
};

export default UserDashboard;



