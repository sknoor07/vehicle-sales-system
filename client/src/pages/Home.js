import React from 'react';

const Home = () => {
  // Check if the user is logged in by looking for the token in localStorage
  const isLoggedIn = Boolean(localStorage.getItem('token'));

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      <div className="text-center px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
          Welcome to Vehicle Sales Management
        </h1>
        <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl">
          Browse our wide selection of vehicles or manage your sales as an admin with ease.
        </p>
        <div className="space-x-4">
          <a
            href="/vehicles"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Browse Vehicles
          </a>
          
          {/* Show login button only if user is not logged in */}
          {!isLoggedIn && (
            <a
              href="/user-panel"
              className="inline-block bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition duration-300"
            >
              Login
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
