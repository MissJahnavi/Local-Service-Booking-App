import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState({
    isLoggedIn: false,
    role: null,
    name: '',
  });

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');
    JSON.parse(localStorage.getItem('user'));

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
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="text-xl font-bold">
          <Link to="/">LocalServices</Link>
        </div>

        <nav className="hidden md:flex space-x-6">
          <Link to="/">Home</Link>
          <Link to="/browseServices">Services</Link>
          {user.role === 'user' && (
            <>
              <Link to="/userBookings">My Bookings</Link>
              <Link to="/userDashboard">Dashboard</Link>
            </>
          )}
          {user.role === 'business' && (
            <>
              <Link to="/businessDashboard">Dashboard</Link>
            </>
          )}
          {user.role === 'admin' && (
            <>
              <Link to="/adminDashboard">Dashboard</Link>
            </>
          )}
        </nav>

        <div className="hidden md:flex space-x-4">
          {!user.isLoggedIn ? (
            <>
              <Link to="/signin" className="text-sm hover:text-blue-600 px-4 py-2">Sign In</Link>
              <Link to="/signup" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded text-sm">Register</Link>
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

    </header>
  );
}
