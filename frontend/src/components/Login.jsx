import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import '../styles/login.css';

const roles = ["Warden", "Admin", "Student"];

const Login = () => {
  const navigate = useNavigate(); 

  const [formData, setFormData] = useState({
    role: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("https://hmsbackendserver.onrender.com/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);

        localStorage.setItem("user", JSON.stringify(data.user));

        console.log("Logged in user:", data.user);

        if (data.user.role === "Student") {
          navigate("/student-dashboard");
        } else {
          navigate("/");
        }
      } else {
        alert(data.message || "Login failed");
      }

    } catch (error) {
      console.error("Login error:", error);
      alert("Server error. Try again later.");
    }
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label>
        Role
        <select
          name="role"
          value={formData.role}
          onChange={handleChange}
          required
        >
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </label>

      <label>
        Email
        <input
          type="email"
          name="email"
          required
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
        />
      </label>

      <label>
        Password
        <input
          type="password"
          name="password"
          required
          placeholder="Enter password"
          value={formData.password}
          onChange={handleChange}
        />
      </label>

      <button type="submit" className="form-btn">Login</button>
    </form>
  );
};

export default Login;
