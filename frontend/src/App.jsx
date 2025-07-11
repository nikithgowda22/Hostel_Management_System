import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import PublicLayout from "./layouts/PublicLayout";
import DashboardLayout from "./layouts/DashboardLayout";

import HeroSection from "./components/HeroSection";
import Facilities from "./components/Facilities";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";
import StudentDashboard from "./components/dashboards/StudentDashboard"; 
import AdminDashboard from "./components/dashboards/AdminDashboard";

const HomePage = () => (
  <>
    <HeroSection />
    <div id="facilities">
      <Facilities />
    </div>
    <div id="contact">
      <Contact />
    </div>
  </>
);

function App() {
  return (
    <Router>
      <Routes>

        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />
        <Route
          path="/login"
          element={
            <PublicLayout>
              <Login />
            </PublicLayout>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicLayout>
              <Signup />
            </PublicLayout>
          }
        />

        <Route
          path="/student-dashboard"
          element={
              <StudentDashboard />
          }
        />

        <Route
          path="/admin-dashboard"
          element={
              <AdminDashboard />
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
