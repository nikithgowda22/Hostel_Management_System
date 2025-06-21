import React from 'react';
import '../styles/signup.css';

const roles = ["Warden", "Admin", "Student"];

const Signup = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle signup logic here
    console.log('Signup form submitted');
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <h2>Sign Up</h2>
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
        Name
        <input type="text" required placeholder="Full Name" />
      </label>
      <label>
        Email
        <input type="email" required placeholder="Enter your email" />
      </label>
      <label>
        Password
        <input type="password" required placeholder="Create password" />
      </label>
      <label>
        Confirm Password
        <input type="password" required placeholder="Confirm password" />
      </label>
      <button type="submit" className="form-btn">Sign Up</button>
    </form>
  );
};

export default Signup;