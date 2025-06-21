import React from 'react';
import '../styles/login.css';

const roles = ["Warden", "Admin", "Student"];

const Login = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login form submitted');
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Login</h2>
      <label>
        Role
        <select required>
          <option value="">Select Role</option>
          {roles.map(role => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </label>
      <label>
        Email
        <input type="email" required placeholder="Enter your email" />
      </label>
      <label>
        Password
        <input type="password" required placeholder="Enter password" />
      </label>
      <button type="submit" className="form-btn">Login</button>
    </form>
  );
};

export default Login;