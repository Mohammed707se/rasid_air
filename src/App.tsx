import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import LiveTracking from './pages/LiveTracking';
import Maintenance from './pages/Maintenance';
import Reports from './pages/Reports';
import Scheduling from './pages/Scheduling';
import Inventory from './pages/Inventory';
import Predictive from './pages/Predictive';
import AircraftDetail from './pages/AircraftDetail';
import MaintenanceDetail from './pages/MaintenanceDetail';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-900 text-white font-tajawal">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="live-tracking" element={<LiveTracking />} />
            <Route path="maintenance" element={<Maintenance />} />
            <Route path="maintenance/:id" element={<MaintenanceDetail />} />
            <Route path="reports" element={<Reports />} />
            <Route path="scheduling" element={<Scheduling />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="predictive" element={<Predictive />} />
            <Route path="aircraft/:id" element={<AircraftDetail />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;