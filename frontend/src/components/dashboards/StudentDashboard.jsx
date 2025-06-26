// import React, { useEffect, useState } from 'react';

// const StudentDashboard = () => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = JSON.parse(localStorage.getItem('user'));
//     if (!storedUser || storedUser.role !== "Student") {
//       window.location.href = "/login"; 
//     } else {
//       setUser(storedUser);
//     }
//   }, []);

//   if (!user) return <p>Loading...</p>;

//   return (
//     <div className="dashboard">
//       <h1>Welcome, {user.name}</h1>
//       <p>Email: {user.email}</p>
//     </div>
//   );
// };

// export default StudentDashboard;
import React, { useState } from 'react';
import './Dashboard.css';

const StudentDashboard = () => {
  const [currentView, setCurrentView] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

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

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'courses', label: 'Courses', icon: '📚' },
    { id: 'rooms', label: 'Rooms', icon: '🏠' },
    { id: 'student-registration', label: 'Student Registration', icon: '👥' },
    { id: 'manage-students', label: 'Manage Students', icon: '👨‍🎓' },
    { id: 'complaints', label: 'Complaints', icon: '📝' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'user-access-logs', label: 'User Access logs', icon: '📋' }
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

  const renderRegistration = () => (
    <div className="registration-content">
      <h1 className="page-title">Registration</h1>
      <form className="registration-form">
        <div className="form-section">
          <div className="section-header">FILL ALL INFO</div>

          <div className="form-subsection">
            <h3 className="subsection-title">Room Related Info</h3>
            <div className="form-row">
              <label>Room no.</label>
              <select>
                <option>Select Room</option>
                <option>Room 101</option>
                <option>Room 102</option>
                <option>Room 103</option>
              </select>
            </div>
            <div className="form-row">
              <label>Seater</label>
              <input type="text" />
            </div>
            <div className="form-row">
              <label>Fees Per Month</label>
              <input type="text" />
            </div>
            <div className="form-row">
              <label>Food Status</label>
              <div className="radio-group">
                <label><input type="radio" name="food" /> Without Food</label>
                <label><input type="radio" name="food" /> With Food (Rs 2000.00 Per Month Extra)</label>
              </div>
            </div>
            <div className="form-row">
              <label>Stay From</label>
              <input type="date" />
            </div>
            <div className="form-row">
              <label>Duration</label>
              <select>
                <option>Select Duration in Month</option>
                <option>1 Month</option>
                <option>3 Months</option>
                <option>6 Months</option>
                <option>12 Months</option>
              </select>
            </div>
          </div>

          <div className="form-subsection">
            <h3 className="subsection-title">Personal Info</h3>
            <div className="form-row">
              <label>Course</label>
              <select>
                <option>Select Course</option>
                <option>Computer Science</option>
                <option>Engineering</option>
                <option>Medicine</option>
              </select>
            </div>
            <div className="form-row">
              <label>Registration No.</label>
              <input type="text" defaultValue="10800121" />
            </div>
            <div className="form-row">
              <label>First Name</label>
              <input type="text" defaultValue="Anuj" />
            </div>
            <div className="form-row">
              <label>Middle Name</label>
              <input type="text" />
            </div>
            <div className="form-row">
              <label>Last Name</label>
              <input type="text" defaultValue="kumar" />
            </div>
            <div className="form-row">
              <label>Gender</label>
              <input type="text" defaultValue="male" />
            </div>
            <div className="form-row">
              <label>Contact No.</label>
              <input type="text" defaultValue="1234567890" />
            </div>
            <div className="form-row">
              <label>Email Id</label>
              <input type="email" defaultValue="test@gmail.com" />
            </div>
            <div className="form-row">
              <label>Emergency Contact</label>
              <input type="text" />
            </div>
            <div className="form-row">
              <label>Guardian Name</label>
              <input type="text" />
            </div>
            <div className="form-row">
              <label>Guardian Relation</label>
              <input type="text" />
            </div>
            <div className="form-row">
              <label>Guardian Contact no.</label>
              <input type="text" />
            </div>
          </div>

          <div className="form-subsection">
            <h3 className="subsection-title">Correspondence Address</h3>
            <div className="form-row">
              <label>Address</label>
              <textarea rows="4"></textarea>
            </div>
            <div className="form-row">
              <label>City</label>
              <input type="text" />
            </div>
            <div className="form-row">
              <label>State</label>
              <select>
                <option>Select State</option>
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Karnataka</option>
              </select>
            </div>
            <div className="form-row">
              <label>Pincode</label>
              <input type="text" />
            </div>
          </div>

          <div className="form-subsection">
            <h3 className="subsection-title">Permanent Address</h3>
            <div className="form-row">
              <label>
                <input type="checkbox" /> Permanent Address same as Correspondence address
              </label>
            </div>
            <div className="form-row">
              <label>Address</label>
              <textarea rows="4"></textarea>
            </div>
            <div className="form-row">
              <label>City</label>
              <input type="text" />
            </div>
            <div className="form-row">
              <label>State</label>
              <select>
                <option>Select State</option>
                <option>Delhi</option>
                <option>Mumbai</option>
                <option>Karnataka</option>
              </select>
            </div>
            <div className="form-row">
              <label>Pincode</label>
              <input type="text" />
            </div>
          </div>

          <div className="form-buttons">
            <button type="button" className="btn-cancel">Cancel</button>
            <button type="submit" className="btn-register">Register</button>
          </div>
        </div>
      </form>
    </div>
  );

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return renderDashboard();
      case 'student-registration':
        return renderRegistration();
      default:
        return (
          <div className="dashboard-content">
            <h1 className="page-title">{menuItems.find(item => item.id === currentView)?.label || 'Page'}</h1>
            <p>This section is under development.</p>
          </div>
        );
    }
  };

  return (
    <div className="hostel-management">
      <nav className="top-nav">
        <div className="nav-left">
          <button
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <h1>Hostel Management System</h1>
        </div>
        <div className="nav-right">
          <div className="user-account">
            <div className="user-avatar">👤</div>
            <span>Account</span>
            <span className="dropdown-arrow">▼</span>
          </div>
        </div>
      </nav>

      <div className="main-container">
        <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-header">
            <span className="sidebar-title">MAIN</span>
          </div>
          <nav className="sidebar-nav">
            {menuItems.map((item) => (
              <button
                key={item.id}
                className={`nav-item ${currentView === item.id ? 'active' : ''}`}
                onClick={() => setCurrentView(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
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

export default StudentDashboard;
