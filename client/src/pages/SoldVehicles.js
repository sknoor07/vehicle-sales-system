import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SoldVehicles = () => {
  const [soldVehicles, setSoldVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const fetchSoldVehicles = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Fetching with token:', token);
      const response = await axios.get('http://localhost:5000/api/sold-vehicles', {
        headers: { 'x-auth-token': token },
      });
      console.log('Fetched sold vehicles:', response.data);
      setSoldVehicles(Array.isArray(response.data) ? response.data : []);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      setError(err.response ? err.response.data.message : 'Failed to fetch sold vehicles');
    }
  };

  const deleteSoldVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to delete this sold vehicle?')) return;
    try {
      console.log('Attempting to delete sold vehicle with ID:', id); // Log ID
      const response = await axios.delete(`http://localhost:5000/api/sold-vehicles/${id}`, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      console.log('Delete response:', response.data); // Log success response
      alert('Sold vehicle deleted successfully!');
      fetchSoldVehicles(); // Refresh list
    } catch (err) {
      console.error('Delete error:', err.response?.data || err.message); // Log error details
      setError(err.response ? err.response.data.message : 'Failed to delete sold vehicle');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        console.log('Decoded token:', decoded);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Token decode error:', err);
      }
    }
    fetchSoldVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Sold Vehicles</h1>
      {error && <p className="text-red-500">{error}</p>}
      {soldVehicles.length === 0 ? (
        <p className="text-gray-600">No sold vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {soldVehicles.map((vehicle) => (
            <div key={vehicle._id} className="bg-white p-4 rounded-lg shadow-lg">
              {vehicle.imageUrl && (
                <img
                  src={`http://localhost:5000${vehicle.imageUrl}`}
                  alt={vehicle.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <h2 className="text-xl font-semibold">{vehicle.name}</h2>
              <p className="text-gray-600">{vehicle.category}</p>
              <p className="text-gray-800 font-bold">${vehicle.price}</p>
              <p className="text-gray-600">{vehicle.description}</p>
              <p className="text-gray-500">Sold on: {new Date(vehicle.soldDate).toLocaleDateString()}</p>
              {userRole === 'admin' && (
                <button
                  onClick={() => deleteSoldVehicle(vehicle._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={fetchSoldVehicles}
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Refresh
      </button>
    </div>
  );
};

export default SoldVehicles;