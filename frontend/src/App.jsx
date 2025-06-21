// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";

import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import Facilities from "./components/Facilities";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Signup from "./components/Signup";

function HomePage() {
  return (
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
}

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Router>
  );
}

export default App;
