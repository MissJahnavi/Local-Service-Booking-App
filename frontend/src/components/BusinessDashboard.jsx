import React, { useState, useEffect } from 'react';
import CalendarView from './CalendarView';
import DatePicker from 'react-multi-date-picker'
import axios from 'axios';

const BusinessDashboard = () => {
    const [activeTab, setActiveTab] = useState('services');
    const [services, setservices] = useState([])
    const [bookings, setbookings] = useState([])
    const [isEditing, setIsEditing] = useState(false)
    const [editingServiceId, setEditingServiceId] = useState(null)
    const [newService, setnewService] = useState({
        serviceName: '',
        category: '',
        description: '',
        price: '',
        location: '',
        image: null
        // business:''
    })
    const [availability, setAvailability] = useState({
        workingDays: [],
    });
    const [holidayDates, setHolidayDates] = useState([]);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];


    const fetchServices = async () => {
        try {

            const res = await axios.get('http://localhost:5000/businessDashboard/my-services', { withCredentials: true })

            setservices(res.data);


        } catch (error) {
            console.error('Error fetching services:', error);
        }
    }

    const fetchBookings = async () => {
        try {
            const res = await axios.get('http://localhost:5000/businessDashboard/request', {
                withCredentials: true,
            });
            // console.log("Raw bookings response:", res.data);
            // console.log("First booking user object:", res.data[0].user);

            setbookings(res.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    }



    const handleChange = (e) => {
        setnewService({ ...newService, [e.target.name]: e.target.value })
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setnewService({ ...newService, image: file })
    }

    const handleAddService = async (e) => {
        e.preventDefault();

        try {
            if (isEditing) {
                const updatedService = {
                    serviceName: newService.serviceName,
                    category: newService.category,
                    price: newService.price,
                    description: newService.description,
                    location: newService.location,
                    image: newService.image, 
                };

                await axios.patch(
                    `http://localhost:5000/businessDashboard/service/${editingServiceId}`,
                    updatedService,
                    {
                        withCredentials: true,
                    }
                );

                console.log('Submitting service data:', newService);

                alert('Service updated');
            }
            else {
                const res = await axios.post('http://localhost:5000/businessDashboard/postServices', newService, { withCredentials: true })
                alert('Service added');
                setservices([...services, res.data]);
                setnewService({ serviceName: '', category: '', price: '', description: '', location: '', image: '' });
            }
            setIsEditing(false);
            setEditingServiceId(null);
            fetchServices();


        } catch (error) {

            alert(isEditing ? 'Failed to update service' : 'Failed to add service');
            console.error('Error submitting service:', error);
        }


    }

    const handleEdit = async (service) => {
        setnewService({
            serviceName: service.serviceName,
            category: service.category,
            price: service.price,
            description: service.description,
            location: service.location,
            image: null,
        });
        setIsEditing(true);
        setEditingServiceId(service._id)
    }
    const handleDelete = async (id) => {
        if (!window.confirm('Delete this service permanently?')) return;
        try {
            await axios.delete(`http://localhost:5000/businessDashboard/delete-service/${id}`, {
                withCredentials: true,
            });
            setservices((prev) => prev.filter((s) => s._id !== id));
        } catch (err) {
            console.error('Error deleting service:', err);
        }
    };


    const handleAccept = async (bookingId) => {
        try {
            await axios.put(`http://localhost:5000/businessDashboard/requests/${bookingId}/accept`, {}, { withCredentials: true })
            alert('Booking Accepted')
            fetchBookings();
        } catch (error) {
            console.error(`Error updating booking`, error);
            alert('Error accepting booking')
        }

    }

    const handleReject = async (bookingId) => {
        try {
            await axios.put(`http://localhost:5000/businessDashboard/requests/${bookingId}/reject`, {}, { withCredentials: true })
            alert('Booking Rejected')

            fetchBookings();
        } catch (error) {
            console.error(`Error updating booking`, error);
            alert('Error rejecting booking')
        }

    }

    const handleCheckboxChange = async (day, type) => {
        setAvailability(prev => {
            const updated = { ...prev };

            if (updated[type].includes(day)) {
                updated[type] = updated[type].filter((d) => d !== day)
            }
            else {
                updated[type] = [...updated[type], day]
            }
            return updated;
        }
        )
    }

    const saveAvailability = async () => {
        try {
            const dataToSend = {
                workingDays: availability.workingDays,
                holidays: holidayDates.map(date => new Date(date).toISOString())
            }
            const res = await axios.post('http://localhost:5000/businessDashboard/availability', dataToSend, { withCredentials: true })

            // setAvailability(res.data)
            alert('Availability saved!');
        } catch (error) {
            console.error("Error saving availability", error);
        }
    }

    const fetchAvailability = async () => {
        try {
            const res = await axios.get('http://localhost:5000/businessDashboard/availability', {
                withCredentials: true,
            });
            if (res.data) setAvailability(res.data);
        } catch (err) {
            console.error("Error fetching availability", err);
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/user/logout', {}, { withCredentials: true });
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

    useEffect(() => {
        fetchServices();
        fetchBookings();
        fetchAvailability();
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md flex flex-col justify-between">
                <div>
                    <div className="p-6 text-xl font-bold border-b">Business Dashboard</div>
                    <nav className="flex flex-col p-4 gap-4">
                        <button onClick={() => setActiveTab('services')} className="text-left hover:font-semibold">
                            My Services
                        </button>
                        <button onClick={() => setActiveTab('Manage services')} className="text-left hover:font-semibold">
                            Manage Services
                        </button>
                        <button onClick={() => setActiveTab('calendar')} className="text-left hover:font-semibold">
                            Calendar
                        </button>
                        <button onClick={() => setActiveTab('bookings')} className="text-left hover:font-semibold">
                            Bookings
                        </button>
                        <button onClick={() => setActiveTab('availability')} className="text-left hover:font-semibold">
                            Availability
                        </button>
                    </nav>
                </div>


                <div className="p-4 border-t">
                    <button
                        onClick={handleLogout}
                        className="text-left w-full text-red-600 hover:font-semibold"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {activeTab === 'services' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">My Services</h2>
                        <ul className='space-y-2'>
                            {services.map((service) => (
                                <li key={service._id} className="bg-white p-4 rounded shadow">
                                    <p><strong>{service.serviceName}</strong></p>
                                    <p>{service.category} - ₹{service.price}</p>
                                </li>
                            ))}

                        </ul>

                    </div>
                )}
                {activeTab == 'Manage services' && (
                    <div>
                        <h2 className="text-2xl font-semibold mb-4">Manage Services</h2>
                        {/* Service Form */}
                        <form onSubmit={handleAddService} className="bg-white p-4 rounded shadow mb-8 grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="serviceName"
                                value={newService.serviceName}
                                onChange={handleChange}
                                placeholder="Service Name"
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                name="category"
                                value={newService.category}
                                onChange={handleChange}
                                placeholder="Category"
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="number"
                                name="price"
                                value={newService.price}
                                onChange={handleChange}
                                placeholder="Price"
                                className="border p-2 rounded"
                                required
                            />
                            <input
                                type="text"
                                name="description"
                                value={newService.description}
                                onChange={handleChange}
                                placeholder="Description"
                                className="border p-2 rounded"
                            />
                            <input
                                type="text"
                                name="location"
                                value={newService.location}
                                onChange={handleChange}
                                placeholder="location"
                                className="border p-2 rounded"
                            />
                            <input

                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="border p-2 rounded col-span-2"
                            />

                            <button
                                type="submit"
                                className="col-span-2 bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
                            >
                                Add Service
                            </button>
                        </form>

                        {/* Service List */}
                        <div className="grid grid-cols-1 gap-4">
                            {services.map((service) => (
                                <div key={service._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                    <div>
                                        <h3 className="font-semibold text-lg">{service.serviceName}</h3>
                                        <p className="text-sm text-gray-500">{service.category} | ₹{service.price}</p>
                                    </div>
                                    <div>
                                        <button
                                            onClick={() => handleEdit(service)}
                                            className="px-3 py-1 mr-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(service._id)}
                                            className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    // </div>


                )
                }
                {
                    activeTab === 'calendar' && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Booking Calendar</h2>
                            {/* <p className="text-gray-600">View your bookings in daily or weekly mode.</p> */}
                            <CalendarView />
                        </div>
                    )
                }
                {
                    activeTab === 'bookings' && (
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold mb-4">Appointment Requests</h2>
                            {console.log("Bookings:", bookings)}
                            {bookings.map((b) => (
                                <div key={b._id} className="bg-white p-4 rounded shadow flex justify-between items-center">
                                    <div>
                                        {console.log('Bookings:', bookings)}
                                        {console.log(b.user)}

                                        <p className="font-semibold">{b.user?.fullName}-{b.service?.serviceName}</p>
                                        <p className="text-sm text-gray-600">{new Date(b.bookingDate).toLocaleDateString()} at {b.timeSlot}</p>
                                    </div>

                                    {b.status === 'pending' ? (
                                        <div className="flex gap-2">
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleAccept(b._id)}
                                                    className="bg-green-500 text-white px-3 py-1 rounded"
                                                >
                                                    Accept
                                                </button>
                                                <button
                                                    onClick={() => handleReject(b._id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <span
                                            className={`px-3 py-1 rounded text-white text-sm ${b.status === 'confirmed' ? 'bg-green-600' : 'bg-red-600'
                                                }`}
                                        >
                                            {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                                        </span>
                                    )}




                                </div>

                            ))}
                            <p className="text-gray-600">Accept or reject appointment requests.</p>
                        </div>
                    )
                }
                {
                    activeTab === 'availability' && (
                        <div>
                            <h2 className="text-2xl font-semibold mb-4">Availability Settings</h2>
                            <p className="text-gray-600 mb-2">Set your working days and holidays.</p>

                            {/* Working Days Section */}
                            <div className="mb-4">
                                <h3 className="font-semibold">Working Days</h3>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {daysOfWeek.map(day => (
                                        <label key={day} className="flex items-center gap-1">
                                            <input
                                                type="checkbox"
                                                checked={availability.workingDays.includes(day)}
                                                onChange={() => handleCheckboxChange(day, 'workingDays')}
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>

                                {/* Display Selected Working Days */}
                                <div className="text-sm text-gray-700">
                                    <strong>Currently the working days are:</strong>{" "}
                                    {availability.workingDays.length > 0
                                        ? availability.workingDays.join(', ')
                                        : 'No working days selected'}
                                </div>
                            </div>

                            {/* Holidays Section */}
                            <div className="mb-4">
                                <h3 className="font-semibold">Holidays (Pick Dates)</h3>
                                <DatePicker
                                    multiple
                                    value={holidayDates}
                                    onChange={setHolidayDates}
                                    format="YYYY-MM-DD"
                                    className="border p-2 rounded"
                                />

                                {/* Display Selected Holiday Dates */}
                                <div className="mt-2 text-sm text-gray-700">
                                    <strong>Selected holidays:</strong>{" "}
                                    {holidayDates.length > 0
                                        ? holidayDates.map(d => d.format?.('YYYY-MM-DD') || d).join(', ')
                                        : 'No holidays selected'}
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                                onClick={saveAvailability}
                            >
                                Save Availability
                            </button>
                        </div>
                    )
                }


            </main >
        </div >
    );
};

export default BusinessDashboard;
