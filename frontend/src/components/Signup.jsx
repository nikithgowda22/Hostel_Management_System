import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/signup.css';

const roles = ["Warden/Admin", "Student"];

const Signup = () => {
  const navigate = useNavigate(); 
  const [formData, setFormData] = useState({
    role: '',
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response = await fetch('https://hmsbackendserver2.onrender.com/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const result = await response.json();
      if (response.ok) {
        alert(result.message || "Signup successful. Please verify your email.");
        navigate("/login"); 
      } else {
        alert(result.message || "Signup failed!");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>

      <label>
        Role
        <select name="role" required value={formData.role} onChange={handleChange}>
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </label>

      <label>
        Name
        <input type="text" name="name" required placeholder="Full Name" value={formData.name} onChange={handleChange} />
      </label>

      <label>
        Email
        <input type="email" name="email" required placeholder="Enter your email" value={formData.email} onChange={handleChange} />
      </label>

      <label>
        Password
        <input type="password" name="password" required placeholder="Create password" value={formData.password} onChange={handleChange} />
      </label>

      <label>
        Confirm Password
        <input type="password" name="confirmPassword" required placeholder="Confirm password" value={formData.confirmPassword} onChange={handleChange} />
      </label>

      <button type="submit" className="form-btn">Sign Up</button>
    </form>
  );
};

export default Signup;
