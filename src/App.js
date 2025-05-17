import React from "react";
import Dashboard from "./components/Dashboard.js";
import PublicRFIDPage from "./public/PublicRFIDPage.js";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/public" element={<PublicRFIDPage />} />
      </Routes>
    </Router>
  );
}
