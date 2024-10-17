import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import { appwriteAuthService } from '../../appwrite/auth';

const Admin_Dashboard = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate(); // useNavigate hook to redirect after logout

  const navItems = [
    { name: 'Rent', slug: '/rent' },
    { name: 'Borrow', slug: '/borrow' },
    { name: 'Well Part', slug: '/well-part' },
    { name: 'Expenses', slug: '/expenses' },
    { name: 'Loan', slug: '/loan' },
    { name: 'Reports', slug: '/reports' },
    { name: 'Manage User', slug: '/manage-user' },
  ];

  const handleLogout = async () => {
    try {
      await appwriteAuthService.logout; // Call your logout function
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <aside
      className={`bg-gray-800 text-white h-screen w-64 fixed top-16 left-0 transition-all duration-300 z-40
      ${isMobileMenuOpen ? 'translate-x-0 bg-opacity-100' : '-translate-x-52 bg-opacity-0'} 
      md:bg-opacity-100 md:translate-x-0 md:top-16 pt-8 md:pt-6`}
    >
      <div className="flex justify-between items-center px-4">
        <h1 className="text-lg font-bold">Dashboard</h1>
        {/* Button to Toggle Sidebar */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="text-white md:hidden focus:outline-none"
        >
          {isMobileMenuOpen ? (
            <FontAwesomeIcon icon={faTimes} className="text-2xl" /> // Close icon
          ) : (
            <FontAwesomeIcon icon={faBars} className="text-2xl text-black" /> // Hamburger icon
          )}
        </button>
      </div>

      {/* Navigation Menu */}
      <nav className={`mt-4 ${isMobileMenuOpen ? 'block' : 'hidden'} md:block`}>
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.slug}>
              <NavLink
                to={item.slug}
                className={({ isActive }) =>
                  `block px-6 py-2 rounded-lg ${
                    isActive ? 'bg-gray-700' : 'hover:bg-gray-600'
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        {/* Logout Button */}
        <div className="mt-6 px-6">
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg text-center"
          >
            Logout
          </button>
        </div>
      </nav>
    </aside>
  );
};

export default Admin_Dashboard;
