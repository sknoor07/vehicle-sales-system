import React, { useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');
    setError(null);
  
    const formData = new FormData();
    formData.append('name', name);
    formData.append('category', category);
    formData.append('price', price);
    formData.append('description', description);
    if (image) formData.append('image', image); // Only append if image exists
  
    try {
      console.log('Sending request with:', { name, category, price, description, image: image ? image.name : null });
      const response = await axios.post('http://localhost:5000/api/vehicles', formData, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
        timeout: 30000,
      });
      console.log('Response:', response.data);
      alert('Vehicle added successfully!');
      setName('');
      setCategory('');
      setPrice('');
      setDescription('');
      setImage(null);
    } catch (err) {
      console.error('Axios error:', err.message, err.code);
      setError(err.response ? err.response.data.message : `Network error: ${err.message}`);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Admin Dashboard</h1>
        {error && (
          <p className="text-red-500 text-center mb-4">{error}</p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">
              Vehicle Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter vehicle name"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">
              Category
            </label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              <option value="sedan">Sedan</option>
              <option value="suv">SUV</option>
              <option value="truck">Truck</option>
              <option value="sports">Sports</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter description"
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="4"
            />
          </div>
          <div className="mb-6">
            <label htmlFor="image" className="block text-gray-700 font-semibold mb-2">
              Vehicle Image
            </label>
            <input type="file" id="image" onChange={(e) => setImage(e.target.files[0])} className="w-full p-3 border rounded-lg" />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Add Vehicle
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;