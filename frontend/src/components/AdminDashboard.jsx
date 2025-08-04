import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Tab, Tabs } from './Tab';
import { Card, CardContent } from './Card';
import { Button } from './Button';
import api from '../api';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [services, setServices] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  const [monthlyStats, setMonthlyStats] = useState([]);
  const [summary, setSummary] = useState();

  const token = localStorage.getItem('token');
  // console.log(token)
  localStorage.setItem('token', token);


  const fetchData = async () => {
    try {
      const [userRes, serviceRes, bookingRes, reportSummaryRes, reportRes] = await Promise.all([
        api.get('/admin/users', { withCredentials: true }),
        api.get('/admin/service', { withCredentials: true }),
        api.get('/admin/bookings', { withCredentials: true }),
        // axios.get('/admin/payments', config),
        api.get('/admin/report/summary', { withCredentials: true }),
        api.get('/admin/report/monthly', { withCredentials: true }),
      ]);

      console.log('User API response:', userRes.data);

      setUsers(userRes.data);
      setServices(serviceRes.data);
      setBookings(bookingRes.data);
      // setPayments(paymentRes.data);
      // console.log("Monthly report API response:", reportRes.data);
      setSummary(reportSummaryRes.data)
      setMonthlyStats(reportRes.data.result);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  const updateUserRole = async (id, role) => {
    try {
      await api.patch(`/admin/user/${id}`, { role }, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/admin/user/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const deleteService = async (id) => {
    try {
      await api.delete(`/admin/service/${id}`, { withCredentials: true });
      fetchData();
    } catch (err) {
      console.error('Failed to delete service:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      <Tabs defaultValue="users">
        <Tab value="users" label="Users">
          <Card><CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="w-1/4 border p-2">Name</th><th className="w-1/4  border p-2">Email</th><th className="w-1/4  border p-2">Role</th><th className="w-1/4  border p-2">Actions</th></tr></thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="border-b mb-6">
                    <td className='border p-2'>{user.fullName}</td>
                    <td className='border p-2'>{user.email}</td>
                    <td className='border p-2'>{user.role}</td>
                    <td className="flex gap-2 mb-1 mt-1 border-r p-2 ">
                      <Button size="sm" onClick={() => updateUserRole(user._id, user.role === 'user' ? 'business' : 'user')}>Toggle Role</Button>
                      <Button size="sm" variant="destructive" onClick={() => deleteUser(user._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent></Card>
        </Tab>

        <Tab value="services" label="Services">
          <Card><CardContent>
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className='w-1/4 border p-2'>Service</th><th className='w-1/4 border p-2'>Category</th><th className='w-1/4 border p-2'>Business</th><th className='w-1/4 border p-2'>Actions</th></tr></thead>
              <tbody>
                {services.map(service => (
                  <tr key={service._id} className="border-b ">
                    <td className='border p-2'>{service.serviceName}</td>
                    <td className='border p-2'>{service.category}</td>
                    <td className='border p-2'>{service.business}</td>
                    <td className='mb-1 mt-1 p-2 border-r'>
                      <Button size="sm" variant="destructive" onClick={() => deleteService(service._id)}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent></Card>
        </Tab>

        <Tab value="bookings" label="All Bookings">
          <Card><CardContent>
            <table className="w-full text-sm">
              <thead><tr><th className='w-1/4 border p-2'>User</th><th className='w-1/4 border p-2'>Service</th><th className='w-1/4 border p-2'>Date</th><th className='w-1/4 border p-2'>Status</th></tr></thead>
              <tbody>
                {bookings.map(booking => (
                  <tr key={booking._id} className="border-b ">
                    <td className='border p-2'>{booking.user?.fullName}</td>
                    <td className='border p-2'>{booking.service?.serviceName}</td>
                    <td className='border p-2'>{new Date(booking.bookingDate).toLocaleDateString()}</td>
                    <td className='border p-2'>{booking.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent></Card>
        </Tab>


        <Tab value="summary" label="Summary Report">
          <Card className="mt-4">
            <CardContent>
              {summary ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div className="bg-blue-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-600">Users</p>
                    <p className="text-xl font-bold">{summary.users}</p>
                  </div>
                  <div className="bg-green-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-600">Businesses</p>
                    <p className="text-xl font-bold">{summary.businesses}</p>
                  </div>
                  <div className="bg-yellow-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-600">Bookings</p>
                    <p className="text-xl font-bold">{summary.bookings}</p>
                  </div>
                  <div className="bg-purple-100 p-4 rounded shadow">
                    <p className="text-sm text-gray-600">Revenue Today</p>
                    <p className="text-xl font-bold">₹{summary.revenueToday}</p>
                  </div>
                </div>
              ) : (
                <p>Loading summary data...</p>
              )}
            </CardContent>
          </Card>
        </Tab>


        <Tab value="stats" label="Reports & Stats">
          <Card>
            <CardContent>
              <h2 className="text-2xl font-bold mb-4 text-gray-800">📈 Monthly Revenue & Bookings</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {monthlyStats.map((stat) => (
                  <div key={stat.month} className="bg-white border rounded-xl shadow-sm p-4 hover:shadow-md transition">
                    <p className="text-sm text-gray-500 mb-1">Month {stat.month}</p>
                    <p className="text-lg font-semibold text-indigo-600">₹{stat.revenue.toLocaleString()}</p>
                    <p className="text-sm text-gray-700">{stat.bookings} Bookings</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </Tab>

      </Tabs>
    </div>
  );
};

export default AdminDashboard;
