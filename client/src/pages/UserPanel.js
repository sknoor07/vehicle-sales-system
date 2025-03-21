import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode'; // For role check

const UserPanel = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [userRole, setUserRole] = useState(null); // For role check
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'user' }); // Registration form state
  const [registerSuccess, setRegisterSuccess] = useState(null); // Registration feedback
  const navigate = useNavigate();

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await axios.post('http://localhost:5000/api/users/login', { email, password });
      localStorage.setItem('token', res.data.token);
      setToken(res.data.token);
      setEmail('');
      setPassword('');
    } catch (err) {
      console.error('Login error:', err.response ? err.response.data : err.message);
      setError(err.response ? err.response.data.message : 'An error occurred during login');
    }
  };

  // Fetch user info after login
  const fetchUserInfo = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No token found. Please log in.');
      setToken(''); // Clear invalid token
      return;
    }

    try {
      const response = await axios.get('http://localhost:5000/api/auth/me', {
        headers: { 'x-auth-token': token },
      });
      setUser(response.data);
      const decoded = jwtDecode(token); // Decode token for role
      setUserRole(decoded.role);
      console.log('User info fetched:', response.data);
    } catch (err) {
      console.error('Fetch error:', err.response?.data || err.message);
      setError(err.response ? err.response.data.message : 'Failed to fetch user info');
      localStorage.removeItem('token'); // Clear invalid token
      setToken(''); // Reset token state
      setUser(null);
      setUserRole(null);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken('');
    setUser(null);
    setUserRole(null);
    navigate('/');
  };

  // Handle Register New User
  const handleRegister = async (e) => {
    e.preventDefault();
    setError(null);
    setRegisterSuccess(null);
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', newUser, {
        headers: { 'x-auth-token': localStorage.getItem('token') },
      });
      console.log('Registration response:', response.data);
      setRegisterSuccess(response.data.message);
      setNewUser({ username: '', email: '', password: '', role: 'user' }); // Reset form
    } catch (err) {
      console.error('Register error:', err.response?.data || err.message);
      setError(err.response ? err.response.data.message : 'Failed to register user');
    }
  };

  // Fetch user info when component mounts or token changes
  useEffect(() => {
    if (token) {
      fetchUserInfo();
    } else {
      setUser(null); // Ensure user is null when no token
      setError(null); // Clear any previous error
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-gray-100 to-gray-200 flex flex-col items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">User Panel</h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!token ? (
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label htmlFor="password" className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
          </form>
        ) : (
          <div className="text-center">
            {user ? (
              <div>
                <div className="bg-white p-6 rounded-lg shadow-lg">
                  <h2 className="text-2xl font-semibold mb-4">Welcome, {user.username}!</h2>
                  <p className="text-gray-600">Email: {user.email}</p>
                  <p className="text-gray-600">Role: {user.role}</p>
                  <p className="text-gray-600">
                    Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                  <button
                    onClick={handleLogout}
                    className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </div>

                {userRole === 'admin' && (
                  <div className="mt-6">
                    <h3 className="text-xl font-semibold mb-4">Register New User</h3>
                    {registerSuccess && <p className="text-green-500 mb-2">{registerSuccess}</p>}
                    <form onSubmit={handleRegister}>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Username</label>
                        <input
                          type="text"
                          value={newUser.username}
                          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Password</label>
                        <input
                          type="password"
                          value={newUser.password}
                          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div className="mb-6">
                        <label className="block text-gray-700 font-semibold mb-2">Role</label>
                        <select
                          value={newUser.role}
                          onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                          className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition duration-300"
                      >
                        Register
                      </button>
                    </form>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-600">Loading user info...</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPanel;