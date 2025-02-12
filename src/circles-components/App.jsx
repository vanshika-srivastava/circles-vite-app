import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Dashboard from "./dashboard";
import CirclesOnboarding from "./circlesonboarding";
import { CirclesSDK } from "../contexts/CirclesSDK";

export default function App() {
  const [trustRelations, setTrustRelations] = useState([]);

  return (
    <CirclesSDK>
      <Router>
        <Routes>
          {/* Route for Circles Onboarding */}
          <Route
            path="/"
            element={
              <CirclesOnboarding setTrustRelations={setTrustRelations} />
            }
          />

          {/* Route for Dashboard */}
          <Route
            path="/dashboard"
            element={<Dashboard trustRelations={trustRelations} />}
          />
        </Routes>
      </Router>
    </CirclesSDK>
  );
}
