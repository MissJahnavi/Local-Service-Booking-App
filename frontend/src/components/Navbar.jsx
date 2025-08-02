import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import UserBookingsTab from './UserBookingsTab';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({
    isLoggedIn: false,
    role: null,
    name: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    JSON.parse(localStorage.getItem('user'))



    if (token && userData) {
      try {
        const parsed = JSON.parse(userData);
        setUser({
          isLoggedIn: true,
          role: parsed.role || null,
          name: parsed.fullName || '',
        });
      } catch (err) {
        console.error("User data parsing failed", err);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    setUser({ isLoggedIn: false, role: null, name: '' });
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">LocalServices</div>

        <nav className="hidden md:flex space-x-6">
          <a href="/">Home</a>
          <a href="/browseServices">Services</a>
          {/* {user.isLoggedIn && <a href="/bookings">Bookings</a>} */}
          {user.role === 'user' && (
            <>
              <a href="/userBookings">My Bookings</a>
              <a href="/userDashboard">Dashboard</a>
            </>
          )

          }
          {user.role === 'business' && (
            <>
              <a href="/businessDashboard">Dashboard</a>
              {/* <a href="/browseServices">My Services</a> */}
              {/* <a href="/availability">Availability</a> */}
            </>
          )}
          {user.role === 'admin' && (
            <>
              <a href="/adminDashboard">Dashboard</a>

            </>
          )}
        </nav>

        <div className="hidden md:flex space-x-4">
          {!user.isLoggedIn ? (
            <>
              <a href="/signin" className="text-sm hover:text-blue-600 px-4 py-2 ">Sign In</a>
              <a href="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">Register</a>
            </>
          ) : (
            <>
              <span className="text-sm text-gray-700">Hi, {user.name}</span>
              <button onClick={handleLogout} className="text-sm text-red-600">Logout</button>
            </>
          )}
        </div>

        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile menu omitted for brevity — same logic applies */}
    </header>
  );
}
