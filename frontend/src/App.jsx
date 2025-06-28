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
      </Routes>
    </Router>
  );
}

export default App;
