import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import UserPanel from './pages/UserPanel';
import VehicleList from './pages/VehicleList';
import SoldVehicles from './pages/SoldVehicles';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route path="/user-panel" element={<UserPanel />} />
        <Route path="/vehicles" element={<VehicleList />} />
        <Route path="/sold-vehicles" element={<SoldVehicles />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;