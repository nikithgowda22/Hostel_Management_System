import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);

  // Add Room form state
  const [roomNo, setRoomNo] = useState('');
  const [seater, setSeater] = useState('');
  const [fees, setFees] = useState('');
  const [roomMessage, setRoomMessage] = useState('');

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    console.log("🔍 AdminDashboard - Stored user:", storedUser);

    if (!storedUser || storedUser.role !== 'Warden/Admin') {
      console.log("❌ Invalid user or role, redirecting to login");
      window.location.href = '/login';
    } else {
      console.log("✅ Valid admin user, setting user state");
      setUser(storedUser);
    }
  }, []);

  const [studentRequests, setStudentRequests] = useState([]);

  useEffect(() => {
    if (currentView === 'student-requests') {
      fetch("http://localhost:8080/api/student/requests")
        .then(res => res.json())
        .then(data => setStudentRequests(data))
        .catch(err => console.error("Error fetching requests:", err));
    }
  }, [currentView]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleApprove = async (id) => {
    await fetch(`http://localhost:8080/api/student/approve/${id}`, { method: 'PUT' });
    setStudentRequests(prev => prev.filter(req => req.id !== id));
  };

  const handleReject = async (id) => {
    await fetch(`http://localhost:8080/api/student/reject/${id}`, { method: 'PUT' });
    setStudentRequests(prev => prev.filter(req => req.id !== id));
  };

  // Handle Add Room form submission
  const handleAddRoomSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!roomNo.trim() || !seater.trim() || !fees.trim()) {
      setRoomMessage("Please fill all fields");
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomNo: roomNo.trim(),
          seater: parseInt(seater, 10),
          fees: parseFloat(fees),
        }),
      });

      if (response.ok) {
        setRoomMessage("✅ Room added successfully!");
        setRoomNo('');
        setSeater('');
        setFees('');
      } else {
        const errorData = await response.json();
        setRoomMessage("❌ Failed to add room: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      setRoomMessage("❌ Error adding room: " + error.message);
    }
  };

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'manage-students', label: 'Manage Students', icon: '👨‍🎓' },
    { id: 'complaints', label: 'Complaints', icon: '📝' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'add-room', label: 'Add Room', icon: '➕' },
    { id: 'student-requests', label: 'Student Registrations', icon: '📥' },
  ];

  const dashboardStats = [
    { title: 'STUDENTS', count: 5, color: 'blue', action: 'FULL DETAIL' },
    { title: 'TOTAL ROOMS', count: 6, color: 'green', action: 'SEE ALL' },
    { title: 'TOTAL COURSES', count: 7, color: 'light-blue', action: 'SEE ALL' },
    { title: 'REGISTERED COMPLAINTS', count: 7, color: 'light-blue', action: 'FULL DETAIL' },
    { title: 'NEW COMPLAINTS', count: 1, color: 'red', action: 'SEE ALL' },
    { title: 'IN PROCESS COMPLAINTS', count: 1, color: 'orange', action: 'SEE ALL' },
    { title: 'CLOSED COMPLAINTS', count: 5, color: 'green', action: 'SEE ALL' },
    { title: 'TOTAL FEEDBACKS', count: 4, color: 'light-blue', action: 'SEE ALL' }
  ];

  const renderDashboard = () => (
    <div className="dashboard-content">
      <h1 className="page-title">Dashboard</h1>
      <div className="stats-grid">
        {dashboardStats.map((stat, index) => (
          <div key={index} className={`stat-card ${stat.color}`}>
            <div className="stat-number">{stat.count}</div>
            <div className="stat-title">{stat.title}</div>
            <div className="stat-action">
              {stat.action} <span className="arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAddRoom = () => (
    <div className="dashboard-content">
      <h1 className="page-title">Add Room</h1>
      <form className="registration-form" onSubmit={handleAddRoomSubmit}>
        <div className="form-row">
          <label>Room No.</label>
          <input
            type="text"
            placeholder="Enter Room Number"
            value={roomNo}
            onChange={e => setRoomNo(e.target.value)}
            required
          />
        </div>
        <div className="form-row">
          <label>Seater</label>
          <input
            type="number"
            placeholder="Enter number of seaters"
            value={seater}
            onChange={e => setSeater(e.target.value)}
            required
            min={1}
          />
        </div>
        <div className="form-row">
          <label>Fees Per Month</label>
          <input
            type="number"
            step="0.01"
            placeholder="Enter monthly fee"
            value={fees}
            onChange={e => setFees(e.target.value)}
            required
            min={0}
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-register">Add Room</button>
        </div>
        {roomMessage && <p className="form-message">{roomMessage}</p>}
      </form>
    </div>
  );

  const renderComplaints = () => (
    <div className="dashboard-content">
      <h1 className="page-title">Complaints</h1>
      <p>List of student complaints (fetch from backend).</p>
    </div>
  );

  const renderFeedback = () => (
    <div className="dashboard-content">
      <h1 className="page-title">Feedback</h1>
      <p>List of student feedback (fetch from backend).</p>
    </div>
  );

  const renderManageStudents = () => (
    <div className="dashboard-content">
      <h1 className="page-title">Manage Students</h1>
      <p>List of all registered students (fetch from backend).</p>
    </div>
  );

  const renderStudentRequests = () => (
    <div className="dashboard-content">
      <h1 className="page-title">Student Registration Requests</h1>
      {studentRequests.length === 0 ? (
        <p>No pending requests</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Room No</th>
              <th>Course</th>
              <th>Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {studentRequests.map((req) => (
              <tr key={req.id}>
                <td>{req.name}</td>
                <td>{req.roomNo}</td>
                <td>{req.course}</td>
                <td>{req.email}</td>
                <td>
                  <button onClick={() => handleApprove(req.id)}>✅ Approve</button>
                  <button onClick={() => handleReject(req.id)}>❌ Reject</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard': return renderDashboard();
      case 'manage-students': return renderManageStudents();
      case 'complaints': return renderComplaints();
      case 'feedback': return renderFeedback();
      case 'add-room': return renderAddRoom();
      case 'student-requests': return renderStudentRequests();
      default: return <p>Page under construction.</p>;
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="hostel-management">
      <nav className="top-nav">
        <div className="nav-left">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <h1>Hostel Management System</h1>
        </div>
        <div className="nav-right">
          <div className="user-dropdown" onClick={() => setShowDropdown(!showDropdown)}>
            <div className="user-account">
              <div className="user-avatar">👤</div>
              <span>{user.name}</span>
              <span className="dropdown-arrow">▼</span>
            </div>
            {showDropdown && (
              <div className="user-dropdown-menu">
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="main-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <nav className="sidebar-nav">
            {menuItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{sidebarOpen && item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
