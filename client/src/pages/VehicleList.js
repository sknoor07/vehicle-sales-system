import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Change to named import

const VehicleList = () => {
  const [vehicles, setVehicles] = useState([]);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null);

  const fetchVehicles = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/vehicles');
      setVehicles(response.data);
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to fetch vehicles');
    }
  };

  const sellVehicle = async (id) => {
    if (!window.confirm('Are you sure you want to sell this vehicle?')) return; // Use window.confirm
    try {
      await axios.post(`http://localhost:5000/api/vehicles/sell/${id}`, {}, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      alert('Vehicle sold successfully!');
      fetchVehicles();
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Failed to sell vehicle');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token); // Use named jwtDecode
        console.log('Decoded token:', decoded);
        setUserRole(decoded.role);
      } catch (err) {
        console.error('Token decode error:', err);
      }
    }
    fetchVehicles();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Vehicles</h1>
      {error && <p className="text-red-500">{error}</p>}
      {vehicles.length === 0 ? (
        <p className="text-gray-600">No vehicles found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((vehicle) => (
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
              {userRole === 'admin' && (
                <button
                  onClick={() => sellVehicle(vehicle._id)}
                  className="mt-2 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Sell Vehicle
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VehicleList;