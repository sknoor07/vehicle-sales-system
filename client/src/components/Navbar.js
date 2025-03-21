import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold tracking-tight">
          Vehicle Sales
        </Link>
        <div className="space-x-6">
          <Link to="/" className="hover:text-blue-300 transition duration-200">
            Home
          </Link>
          <Link to="/user-panel" className="hover:text-blue-300 transition duration-200">
            User Panel
          </Link>
          <Link to="/vehicles" className="hover:text-blue-300 transition duration-200">
            Vehicles
          </Link>
          <Link to="/sold-vehicles" className="hover:text-blue-300 transition duration-200">
            Sold Vehicles
          </Link>
          <Link to="/admin" className="hover:text-blue-300 transition duration-200">
            Admin
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;