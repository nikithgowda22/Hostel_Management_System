import React, { useEffect, useState } from 'react';
import './AdminDashboard.css';
import axios from 'axios';

const AdminDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [students, setStudents] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [feedbacks, setFeedbacks] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [dashboardStat, setDashboardStat] = useState({
    students: 0,
    rooms: 0,
    courses: 0,
    complaints: 0,
    feedbacks: 0,
    leaves: 0,
  });

  // Add Room form state
  const [roomNo, setRoomNo] = useState('');
  const [rooms, setRooms] = useState([]);
  const [seater, setSeater] = useState('');
  const [fees, setFees] = useState('');
  const [roomMessage, setRoomMessage] = useState('');
  const [deleteRoomNo, setDeleteRoomNo] = useState('');
  const [deleteMessage, setDeleteMessage] = useState('');
  const [adminLeaves, setAdminLeaves] = useState([]);
  const fetchRooms = async () => {
    try {
      const res = await fetch("http://localhost:8080/api/rooms");
      const data = await res.json();
      setRooms(data);
    } catch (err) {
      console.error("Failed to fetch rooms:", err);
    }
  };
  useEffect(() => {
    if (currentView === 'add-room') {
      fetchRooms();
    }
  }, [currentView]);

  const fetchAdminLeaves = async () => {
    try {
      const res = await axios.get('http://localhost:8080/api/admin/leaves');
      setAdminLeaves(res.data);
      setDashboardStat(prev => ({
        ...prev,
        leaves: res.data.length,
      }));
    } catch (err) {
      console.error('Error loading leave data:', err);
    }
  };

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
  useEffect(() => {
    if (currentView === 'manage-students') {
      fetch("http://localhost:8080/api/student/all")
        .then(res => res.json())
        .then(data => setStudents(data))
        .catch(err => console.error("Error fetching students:", err));
    }

    if (currentView === 'complaints') {
      fetch("http://localhost:8080/api/student/complaints")
        .then(res => res.json())
        .then(data => setComplaints(data))
        .catch(err => console.error("Error fetching complaints:", err));
    }

    if (currentView === 'feedback') {
      fetch("http://localhost:8080/api/student/feedbacks")
        .then(res => res.json())
        .then(data => setFeedbacks(data))
        .catch(err => console.error("Error fetching feedbacks:", err));
    }
    if (currentView === 'leaves') {
      fetch("http://localhost:8080/api/student/leavecount")
        .then(res => res.json())
        .then(data => setLeaves(data))
        .catch(err => console.error("Error fetching Leaves:", err));
    }
  }, [currentView]);
  useEffect(() => {
    fetch("http://localhost:8080/api/student/dashboard-stats")
      .then(res => res.json())
      .then(data => {
        setDashboardStat({
          students: data.students || 0,
          rooms: data.rooms || 0,
          courses: data.courses || 0,
          complaints: data.complaints || 0,
          feedbacks: data.feedbacks || 0,
          leaves: data.leaves || 0,  // ✅ Add this line
        });
      })
      .catch(err => console.error("Failed to fetch dashboard stats:", err));
  }, []);

  const [studentRequests, setStudentRequests] = useState([]);
  useEffect(() => {
    fetchAdminLeaves();
  }, []);

  const handleLeaveStatusUpdate = async (id, action) => {
    try {
      await axios.put(`http://localhost:8080/api/admin/leaves/${action}/${id}`);
      fetchAdminLeaves();
    } catch (err) {
      console.error(`Failed to ${action} leave`, err);
    }
  };
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
        fetchRooms(); // 🔁 Refresh room list
      } else {
        const errorData = await response.json();
        setRoomMessage("❌ Failed to add room: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      setRoomMessage("❌ Error adding room: " + error.message);
    }
  };

  const handleRemoveRoomSubmit = async (e) => {
    e.preventDefault();

    if (!deleteRoomNo.trim()) {
      setDeleteMessage("Please enter a room number to delete.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/rooms/${deleteRoomNo.trim()}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setDeleteMessage("✅ Room removed successfully!");
        setDeleteRoomNo('');
        fetchRooms(); // 🔁 Refresh room list
      } else {
        const errorData = await response.json();
        setDeleteMessage("❌ Failed to remove room: " + (errorData.message || "Unknown error"));
      }
    } catch (error) {
      setDeleteMessage("❌ Error removing room: " + error.message);
    }
  };
  const renderLeaveRequests = () => (
    <div className="admin-leave-container">
      <h2 className="admin-leave-heading">Leave Applications</h2>
      <table className="admin-leave-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {adminLeaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.studentName}</td>
              <td>{leave.studentEmail}</td>
              <td>{leave.fromDate}</td>
              <td>{leave.toDate}</td>
              <td>{leave.reason}</td>
              <td className={`status ${leave.status.toLowerCase()}`}>
                {leave.status}
              </td>
              <td>
                {leave.status === 'PENDING' && (
                  <>
                    <button
                      onClick={() => handleLeaveStatusUpdate(leave.id, 'approve')}
                      className="btn-approve"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleLeaveStatusUpdate(leave.id, 'reject')}
                      className="btn-reject"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'manage-students', label: 'Manage Students', icon: '👨‍🎓' },
    { id: 'complaints', label: 'Complaints', icon: '📝' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'add-room', label: 'Add Room', icon: '➕' },
    { id: 'student-requests', label: 'Student Registrations', icon: '📥' },
    { id: 'leave-applications', label: 'Leave Requests', icon: '📝' },
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
        <div className="stat-card blue" onClick={() => setCurrentView('manage-students')}>
          <div className="stat-number">{dashboardStat.students}</div>
          <div className="stat-title">STUDENTS</div>
          <div className="stat-action">FULL DETAIL <span className="arrow">→</span></div>
        </div>

        <div className="stat-card green" onClick={() => setCurrentView('add-room')}>
          <div className="stat-number">{dashboardStat.rooms}</div>
          <div className="stat-title">TOTAL ROOMS</div>
          <div className="stat-action">SEE ALL <span className="arrow">→</span></div>
        </div>

        <div className="stat-card light-blue" onClick={() => setCurrentView('leave-applications')}>
          <div className="stat-number">{dashboardStat.leaves}</div>
          <div className="stat-title">LEAVE REQUESTS</div>
          <div className="stat-action">SEE ALL <span className="arrow">→</span></div>
        </div>

        <div className="stat-card orange" onClick={() => setCurrentView('complaints')}>
          <div className="stat-number">{dashboardStat.complaints}</div>
          <div className="stat-title">REGISTERED COMPLAINTS</div>
          <div className="stat-action">FULL DETAIL <span className="arrow">→</span></div>
        </div>

        <div className="stat-card red" onClick={() => setCurrentView('feedback')}>
          <div className="stat-number">{dashboardStat.feedbacks}</div>
          <div className="stat-title">TOTAL FEEDBACKS</div>
          <div className="stat-action">SEE ALL <span className="arrow">→</span></div>
        </div>
      </div>
    </div>
  );


  const renderAddRoom = () => (
    <div className="dashboard-content">
      <h2 className="page-subtitle">All Rooms</h2>
      {rooms.length === 0 ? (
        <p>No rooms available.</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Room No</th>
              <th>Seater</th>
              <th>Fees (₹/month)</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room) => (
              <tr key={room.id}>
                <td>{room.roomNo}</td>
                <td>{room.seater}</td>
                <td>{room.fees}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

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

      <h2 className="page-subtitle">Remove Room</h2>
      <form className="registration-form" onSubmit={handleRemoveRoomSubmit}>
        <div className="form-row">
          <label>Room No. to Remove</label>
          <input
            type="text"
            placeholder="Enter Room Number"
            value={deleteRoomNo}
            onChange={e => setDeleteRoomNo(e.target.value)}
            required
          />
        </div>
        <div className="form-buttons">
          <button type="submit" className="btn-register">Remove Room</button>
        </div>
        {deleteMessage && <p className="form-message">{deleteMessage}</p>}
      </form>
    </div>
  );

  const renderComplaints = () => (
    <div className="dashboard-content">
      <h1 className="page-title">Complaints</h1>
      {complaints.length === 0 ? (
        <p>No complaints available.</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Subject</th>
              <th>Description</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map((complaint) => (
              <tr key={complaint.id}>
                <td>{complaint.studentEmail}</td>
                <td>{complaint.subject}</td>
                <td>{complaint.description}</td>
                <td>{complaint.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );


  const renderFeedback = () => (
    <div className="dashboard-content">
      <h1 className="page-title">Feedback</h1>
      {feedbacks.length === 0 ? (
        <p>No feedback submitted.</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Email</th>
              <th>Message</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {feedbacks.map((feedback) => (
              <tr key={feedback.id}>
                <td>{feedback.studentEmail}</td>
                <td>{feedback.message}</td>
                <td>{feedback.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );


  const renderManageStudents = () => (
    <div className="dashboard-content">
      <h1 className="page-title">Manage Students</h1>
      {students.length === 0 ? (
        <p>No students found.</p>
      ) : (
        <table className="request-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Course</th>
              <th>Fees</th>
              <th>Fees Status</th>
              <th>Duration</th>
              <th>Room No</th>
            </tr>
          </thead>
          <tbody>
            {students.map((student) => (
              <tr key={student.id}>
                <td>{student.name}</td>
                <td>{student.email}</td>
                <td>{student.contact}</td>
                <td>{student.course}</td>
                <td>{student.fees}</td>
                <td>{student.paymentStatus || "Pending"}</td>
                <td>
                  <div style={{ fontWeight: 'bold' }}>{student.duration}</div>
                  <div style={{ fontSize: '0.9em', color: '#555' }}>
                    {(() => {
                      const start = new Date(student.stayFrom);
                      const months = parseInt(student.duration);
                      if (!isNaN(start) && !isNaN(months)) {
                        const end = new Date(start);
                        end.setMonth(start.getMonth() + months);
                        const format = (date) => date.toISOString().split("T")[0]; // Format YYYY-MM-DD
                        return `${format(start)} to ${format(end)}`;
                      }
                      return "Invalid stay dates";
                    })()}
                  </div>
                </td>


                <td>{student.roomNo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
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
      case 'leave-applications': return renderLeaveRequests();
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
              <div
                className="user-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  backgroundColor: '#fff',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                  padding: '10px',
                  zIndex: 1000,
                  minWidth: '200px',
                }}
              >
                <span
                  style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#333',
                  }}
                >
                  {user.email}
                </span>
                <button
                  onClick={handleLogout}
                  style={{
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    width: '100%',
                  }}
                >
                  Logout
                </button>
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
