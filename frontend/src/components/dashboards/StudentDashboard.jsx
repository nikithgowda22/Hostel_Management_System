import React, { useEffect, useState } from 'react';

const StudentDashboard = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.role !== "Student") {
      window.location.href = "/login"; 
    } else {
      setUser(storedUser);
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="dashboard">
      <h1>Welcome, {user.name}</h1>
      <p>Email: {user.email}</p>
    </div>
  );
};

export default StudentDashboard;
