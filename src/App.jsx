import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Dashboard from './dashboard';
import CirclesOnboarding from './circlesonboarding';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Route for Circles Onboarding */}
        <Route path="/" element={<CirclesOnboarding />} />

        {/* Route for Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}
