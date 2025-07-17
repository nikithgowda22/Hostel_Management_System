import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import { useRef } from 'react';
import { handlePayment } from "../payments/paymentUtils";
import { generatePDFReceipt } from "../payments/generatePDFReceipt";
import axios from 'axios';

const StudentDashboard = () => {
  const [currentView, setCurrentView] = useState('student-registration');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isAlreadyRegistered, setIsAlreadyRegistered] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(false);
  const [registrationStatusChecked, setRegistrationStatusChecked] = useState(false);
  const formRef = useRef(null);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [leaveForm, setLeaveForm] = useState({
    reason: '',
    fromDate: '',
    toDate: ''
  });
  const [studentLeaves, setStudentLeaves] = useState([]);
  // New state for complaints, feedback, and access logs
  const [complaint, setComplaint] = useState('');
  const [feedback, setFeedback] = useState('');
  const [accessLogs, setAccessLogs] = useState([]);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    fetch("http://localhost:8080/api/rooms")
      .then(res => res.json())
      .then(data => setRooms(data))
      .catch(err => console.error("Error fetching rooms:", err));
  }, []);
  const handleDownloadReceipt = () => {
    generatePDFReceipt(registrationData);
  };
  const fetchStudentLeaves = async () => {
    if (!user || !user.email) return; // ✅ Prevent error when user is null

    try {
      const res = await axios.get(`http://localhost:8080/api/student/leave?email=${user.email}`);
      setStudentLeaves(res.data);
    } catch (err) {
      console.error('Error fetching leaves:', err);
    }
  };


  useEffect(() => {
    if (user && user.email) {
      fetchStudentLeaves();
    }
  }, [user]);


  const handleLeaveSubmit = async (e) => {
    e.preventDefault();
    const leaveData = {
      ...leaveForm,
      studentEmail: user.email,
      studentName: user.name
    };
    try {
      await axios.post('http://localhost:8080/api/student/leave', leaveData);
      setLeaveForm({ reason: '', fromDate: '', toDate: '' });
      fetchStudentLeaves();
      alert('Leave application submitted successfully.');
    } catch (err) {
      alert('Error submitting leave.');
      console.error(err);
    }
  };


  const [registrationData, setRegistrationData] = useState({
    roomNo: '',
    fees: '',
    foodStatus: '',
    stayFrom: '',
    duration: '',
    course: '',
    regNo: '',
    name: '',
    gender: '',
    contact: '',
    email: '',
    emergencyContact: '',
    guardianName: '',
    guardianRelation: '',
    guardianContact: '',
    corrAddress: '',
    corrCity: '',
    corrState: '',
    corrPincode: '',
    permSame: false,
    permAddress: '',
    permCity: '',
    permState: '',
    permPincode: ''
  });

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    if (!storedUser || storedUser.role !== 'Student') {
      window.location.href = '/login';
    } else {
      setUser(storedUser);
      setRegistrationData(prev => ({
        ...prev,
        name: storedUser.name || '',
        email: storedUser.email || ''
      }));

      // Check if already registered when component mounts
      checkRegistrationAndLoadData(storedUser.email);
      // Fetch access logs
      fetchAccessLogs(storedUser.email);
      // Log the login access
      logAccess('login', storedUser);
    }
  }, []);

  // Check registration status whenever the registration view is accessed
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (
      currentView === 'student-registration' &&
      storedUser &&
      storedUser.email &&
      !registrationStatusChecked
    ) {
      checkRegistrationAndLoadData(storedUser.email);
    }
  }, [currentView, registrationStatusChecked]);

  const checkRegistrationAndLoadData = async (email) => {
    if (!email) return;

    setIsCheckingStatus(true);
    try {
      const res = await fetch(`http://localhost:8080/api/student/check?email=${encodeURIComponent(email.trim())}`);
      const data = await res.json();

      if (data.isRegistered) {
        setIsAlreadyRegistered(true);
        setHasSubmitted(true);

        // ✅ Load full registration data now
        const regRes = await fetch(`http://localhost:8080/api/student/registration?email=${encodeURIComponent(email.trim())}`);
        const regData = await regRes.json();
        setRegistrationData(regData);
      } else {
        setIsAlreadyRegistered(false);
        setHasSubmitted(false);
      }

      setRegistrationStatusChecked(true);
    } catch (err) {
      console.error("Error during registration status check or loading:", err);
      setIsAlreadyRegistered(false);
      setHasSubmitted(false);
      setRegistrationStatusChecked(true);
    } finally {
      setIsCheckingStatus(false);
    }
  };


  const handleLogout = () => {
    logAccess('logout', user);
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  // New functions for complaints, feedback, and access logs
  const logAccess = async (type, userObj = user) => {
    if (!userObj) return;
    try {
      const response = await fetch('http://localhost:8080/api/accesslog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userObj.email,
          action: type,
          timestamp: new Date().toISOString()
        }),
      });

      if (!response.ok) {
        console.error('❌ Failed to log access:', response.statusText);
      }
    } catch (error) {
      console.error('❌ Error logging access:', error);
    }
  };



  const fetchAccessLogs = async (email) => {
    try {
      const res = await fetch(`http://localhost:8080/api/accesslog/${email}`);
      const logs = await res.json();
      setAccessLogs(logs.slice(0, 10)); // Ensure only latest 10 shown
    } catch (error) {
      console.error('❌ Error fetching access logs:', error);
    }
  };

  useEffect(() => {
    if (user && user.email) {
      fetchAccessLogs(user.email);
    }
  }, [user]);

  const submitComplaint = async () => {
    if (!complaint.trim()) {
      alert("Please write a complaint before submitting.");
      return;
    }

    const payload = {
      studentEmail: user.email, // Assuming you have the student email from login
      subject: "Hostel Complaint", // Optional or can be added as a separate input
      description: complaint,
    };

    try {
      const response = await fetch('http://localhost:8080/api/complaints/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        alert("Complaint submitted successfully!");
        setComplaint(""); // Clear textarea
      } else {
        alert("Failed to submit complaint.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred while submitting the complaint.");
    }
  };


  const submitFeedback = async () => {
    if (!feedbackMessage || !feedbackMessage.trim()) {
      alert("Please write some feedback.");
      return;
    }

    const payload = {
      studentEmail: user.email,
      message: feedbackMessage,
    };

    try {
      const response = await fetch("http://localhost:8080/api/feedbacks/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Feedback submitted successfully!");
        setFeedbackMessage("");
      } else {
        alert("Failed to submit feedback.");
      }
    } catch (err) {
      console.error(err);
      alert("An error occurred.");
    }
  };




  const calculateFees = (duration, foodStatus, roomFee) => {
    const foodFee = 2000; // Additional fee per month if food is selected

    let durationMultiplier = 1;
    if (duration === '3 Months') durationMultiplier = 3;
    else if (duration === '6 Months') durationMultiplier = 6;
    else if (duration === '12 Months') durationMultiplier = 12;

    let totalFee = roomFee * durationMultiplier;

    if (foodStatus === 'With Food') {
      totalFee += foodFee * durationMultiplier;
    }

    return totalFee.toString();
  };


  const handleRegChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newData = {
      ...registrationData,
      [name]: type === 'checkbox' ? checked : value
    };

    // Get selected room's fee
    const selectedRoom = rooms.find(r => r.roomNo === (name === "roomNo" ? value : newData.roomNo));
    const roomFee = selectedRoom ? selectedRoom.fees : 0;

    // Update fees based on selected values
    if (name === "roomNo" || name === "duration" || name === "foodStatus") {
      newData.fees = calculateFees(
        name === 'duration' ? value : newData.duration,
        name === 'foodStatus' ? value : newData.foodStatus,
        roomFee
      );
    }

    setRegistrationData(newData);
  };



  const validateStep = (step) => {
    switch (step) {
      case 1:
        return registrationData.roomNo && registrationData.fees &&
          registrationData.foodStatus && registrationData.stayFrom &&
          registrationData.duration;
      case 2:
        return registrationData.course && registrationData.name &&
          registrationData.gender && registrationData.contact &&
          registrationData.email && registrationData.emergencyContact &&
          registrationData.guardianName && registrationData.guardianRelation &&
          registrationData.guardianContact;
      case 3:
        if (!registrationData.corrAddress || !registrationData.corrCity ||
          !registrationData.corrState || !registrationData.corrPincode) {
          return false;
        }

        if (!registrationData.permSame) {
          return registrationData.permAddress && registrationData.permCity &&
            registrationData.permState && registrationData.permPincode;
        }

        return true;
      default:
        return true;
    }
  };

  const nextRegStep = () => {
    if (validateStep(registrationStep)) {
      setRegistrationStep(prev => prev + 1);
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const prevRegStep = () => {
    setRegistrationStep(prev => prev - 1);
  };

  const handleRegistrationSubmit = async (e) => {
    e.preventDefault();

    // Double check if already registered before submitting
    if (isAlreadyRegistered) {
      alert("❌ You have already registered. Please wait for a response within 24 hours.");
      return;
    }

    if (!validateStep(3)) {
      alert('Please fill in all required fields.');
      return;
    }

    // Show loading state
    setIsCheckingStatus(true);

    try {
      const res = await fetch("http://localhost:8080/api/student/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(registrationData),
      });

      const message = await res.text();

      if (res.ok) {
        alert(message);
        setHasSubmitted(true);
        setIsAlreadyRegistered(true);
        setRegistrationStatusChecked(true);
      } else if (res.status === 409) {
        // Already registered
        alert(message);
        setHasSubmitted(true);
        setIsAlreadyRegistered(true);
        setRegistrationStatusChecked(true);
      } else {
        alert(message || "❌ Registration failed. Please try again.");
      }
    } catch (error) {
      console.error("Registration failed", error);
      alert("❌ Something went wrong. Please try again.");
    } finally {
      setIsCheckingStatus(false);
    }
  };

  // Updated menu items - removed dashboard, courses, rooms, manage-students
  const menuItems = [
    { id: 'student-registration', label: 'Student Registration', icon: '👥' },
    { id: 'complaints', label: 'Complaints', icon: '📝' },
    { id: 'feedback', label: 'Feedback', icon: '💬' },
    { id: 'user-access-logs', label: 'User Access Logs', icon: '📋' },
    { id: 'leave-applications', label: 'Leave Applications', icon: '📋' }
  ];

  const renderRegistration = () => {
    // 1. Loading while checking status
    if (isCheckingStatus && !registrationStatusChecked) {
      return (
        <div className="loading-message">
          <h2>Checking registration status...</h2>
          <p>Please wait while we verify your registration status.</p>
        </div>
      );
    }

    // 2. Show if approved
    if (registrationData && registrationData.status === 'APPROVED') {
      return (
        <div className="submitted-message">
          <h2 className="success-message">🎉 Your application has been approved!</h2>
          <div className="payment-section">
            <p><strong>Duration:</strong> {registrationData.duration}</p>
            <p><strong>Food Status:</strong> {registrationData.foodStatus}</p>
            <p><strong>Total Fees:</strong> ₹{registrationData.fees}</p>

            {registrationData.paymentStatus === "Paid" ? (
              <>
                <p className="paid-status" style={{ color: "green", fontWeight: "bold" }}>
                  ✅ Payment Completed
                </p>
                <button className="download-btn" onClick={handleDownloadReceipt}>
                  🧾 Download Receipt
                </button>
              </>
            ) : (
              <button
                className="pay-now-button"
                onClick={() =>
                  handlePayment(registrationData.fees, {
                    name: registrationData.name,
                    email: registrationData.email,
                    contact: registrationData.contact,
                  }, () => {
                    // 🔄 Refresh the payment status safely without reload
                    alert("✅ Payment recorded successfully.");
                    checkRegistrationAndLoadData(user.email);
                  })
                }
              >
                💳 Pay Now
              </button>


            )}
          </div>
        </div>
      );
    }

    // 3. Already submitted but not approved yet
    if (isAlreadyRegistered || hasSubmitted) {
      return (
        <div className="submitted-message">
          <h2>✅ Your application has been submitted!</h2>
          <p>You have already registered. Please wait for a response within 24 hours.</p>
          <p><strong>Note:</strong> Multiple registrations are not allowed.</p>
          <div style={{ marginTop: '20px' }}>
            <button
              onClick={() => checkRegistrationAndLoadData(user.email)}
              disabled={isCheckingStatus}
              style={{
                padding: '10px 20px',
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '5px',
                cursor: isCheckingStatus ? 'not-allowed' : 'pointer'
              }}
            >
              {isCheckingStatus ? 'Checking...' : 'Refresh Status'}
            </button>
          </div>
        </div>
      );
    }

    // 4. Main multi-step registration form
    return (
      <div className="registration-content">
        <h1 className="page-title">Student Registration</h1>
        <div className="registration-note">
          <p><strong>Important:</strong> You can only register once. Please fill all details carefully.</p>
        </div>

        <form className="registration-form" ref={formRef} onSubmit={handleRegistrationSubmit}>
          {/* Step 1 - Room Details */}
          {registrationStep === 1 && (
            <>
              <h3 className="subsection-title">Room Related Info</h3>
              <div className="form-row">
                <label>Room No <span className="required">*</span></label>
                <select name="roomNo" value={registrationData.roomNo} onChange={handleRegChange} required>
                  <option value="">Select Room</option>
                  {rooms.map((room) => (
                    <option key={room.id} value={room.roomNo}>
                      {room.roomNo} - ₹{room.fees}/month
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <label>Duration <span className="required">*</span></label>
                <select name="duration" value={registrationData.duration} onChange={handleRegChange} required>
                  <option value="">Select Duration</option>
                  <option value="1 Month">1 Month</option>
                  <option value="3 Months">3 Months</option>
                  <option value="6 Months">6 Months</option>
                  <option value="12 Months">12 Months</option>
                </select>
              </div>

              <div className="form-row">
                <label>Food Status <span className="required">*</span></label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="foodStatus"
                      value="Without Food"
                      checked={registrationData.foodStatus === "Without Food"}
                      onChange={handleRegChange}
                      required
                    />
                    Without Food
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="foodStatus"
                      value="With Food"
                      checked={registrationData.foodStatus === "With Food"}
                      onChange={handleRegChange}
                    />
                    With Food (+₹2000/month)
                  </label>
                </div>
              </div>

              <div className="form-row">
                <label>Total Fees</label>
                <input
                  type="text"
                  name="fees"
                  value={registrationData.fees ? `₹${registrationData.fees}` : ''}
                  readOnly
                  style={{ backgroundColor: '#f0f0f0' }}
                />
              </div>

              <div className="form-row">
                <label>Stay From <span className="required">*</span></label>
                <input type="date" name="stayFrom" value={registrationData.stayFrom} onChange={handleRegChange} required />
              </div>
            </>
          )}

          {registrationStep === 2 && (
            <>
              <h3 className="subsection-title">Personal Info</h3>
              <div className="form-row">
                <label>Course <span className="required">*</span></label>
                <select name="course" value={registrationData.course} onChange={handleRegChange} required>
                  <option value="">Select Course</option>
                  <option value="Computer Science">Computer Science</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Medicine">Medicine</option>
                </select>
              </div>
              <div className="form-row">
                <label>Registration No.</label>
                <input type="text" value={registrationData.regNo} readOnly style={{ backgroundColor: '#f0f0f0' }} />
              </div>
              <div className="form-row">
                <label>Full Name <span className="required">*</span></label>
                <input type="text" name="name" value={registrationData.name} onChange={handleRegChange} required readOnly style={{ backgroundColor: '#f0f0f0' }} />
              </div>
              <div className="form-row">
                <label>Gender <span className="required">*</span></label>
                <select name="gender" value={registrationData.gender} onChange={handleRegChange} required>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-row">
                <label>Contact No. <span className="required">*</span></label>
                <input type="tel" name="contact" value={registrationData.contact} onChange={handleRegChange} required />
              </div>
              <div className="form-row">
                <label>Email <span className="required">*</span></label>
                <input type="email" name="email" value={registrationData.email} onChange={handleRegChange} required readOnly style={{ backgroundColor: '#f0f0f0' }} />
              </div>
              <div className="form-row">
                <label>Emergency Contact <span className="required">*</span></label>
                <input type="tel" name="emergencyContact" value={registrationData.emergencyContact} onChange={handleRegChange} required />
              </div>
              <div className="form-row">
                <label>Guardian Name <span className="required">*</span></label>
                <input type="text" name="guardianName" value={registrationData.guardianName} onChange={handleRegChange} required />
              </div>
              <div className="form-row">
                <label>Guardian Relation <span className="required">*</span></label>
                <input type="text" name="guardianRelation" value={registrationData.guardianRelation} onChange={handleRegChange} required />
              </div>
              <div className="form-row">
                <label>Guardian Contact No. <span className="required">*</span></label>
                <input type="tel" name="guardianContact" value={registrationData.guardianContact} onChange={handleRegChange} required />
              </div>
            </>
          )}

          {registrationStep === 3 && (
            <>
              <h3 className="subsection-title">Correspondence Address</h3>
              <div className="form-row">
                <label>Address <span className="required">*</span></label>
                <textarea name="corrAddress" rows="3" value={registrationData.corrAddress} onChange={handleRegChange} required />
              </div>
              <div className="form-row">
                <label>City <span className="required">*</span></label>
                <input type="text" name="corrCity" value={registrationData.corrCity} onChange={handleRegChange} required />
              </div>
              <div className="form-row">
                <label>State <span className="required">*</span></label>
                <select name="corrState" value={registrationData.corrState} onChange={handleRegChange} required>
                  <option value="">Select State</option>
                  <option value="Delhi">Delhi</option>
                  <option value="Mumbai">Mumbai</option>
                  <option value="Karnataka">Karnataka</option>
                </select>
              </div>
              <div className="form-row">
                <label>Pincode <span className="required">*</span></label>
                <input type="text" name="corrPincode" value={registrationData.corrPincode} onChange={handleRegChange} required />
              </div>
              <div className="form-row">
                <label>
                  <input type="checkbox" name="permSame" checked={registrationData.permSame} onChange={handleRegChange} />
                  Same as correspondence address
                </label>
              </div>

              {!registrationData.permSame && (
                <>
                  <h3 className="subsection-title">Permanent Address</h3>
                  <div className="form-row">
                    <label>Address <span className="required">*</span></label>
                    <textarea name="permAddress" rows="3" value={registrationData.permAddress} onChange={handleRegChange} required />
                  </div>
                  <div className="form-row">
                    <label>City <span className="required">*</span></label>
                    <input type="text" name="permCity" value={registrationData.permCity} onChange={handleRegChange} required />
                  </div>
                  <div className="form-row">
                    <label>State <span className="required">*</span></label>
                    <select name="permState" value={registrationData.permState} onChange={handleRegChange} required>
                      <option value="">Select State</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Mumbai">Mumbai</option>
                      <option value="Karnataka">Karnataka</option>
                    </select>
                  </div>
                  <div className="form-row">
                    <label>Pincode <span className="required">*</span></label>
                    <input type="text" name="permPincode" value={registrationData.permPincode} onChange={handleRegChange} required />
                  </div>
                </>
              )}
            </>
          )}

          {/* Navigation Buttons */}
          <div className="form-buttons">
            {registrationStep > 1 && (
              <button type="button" onClick={prevRegStep}>Previous</button>
            )}
            {registrationStep < 3 ? (
              <button type="button" onClick={nextRegStep}>Next</button>
            ) : (
              <button type="submit" disabled={isCheckingStatus}>
                {isCheckingStatus ? 'Submitting...' : 'Register'}
              </button>
            )}
          </div>
        </form>
      </div>
    );
  };


  // New render functions for complaints, feedback, and logs
  const renderComplaints = () => (
    <div className="dashboard-content">
      <h1 className="page-title">📢 File Hostel Complaint</h1>
      <div className="section-card">
        <textarea
          value={complaint}
          onChange={(e) => setComplaint(e.target.value)}
          placeholder="Write your complaint here..."
          rows={5}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            resize: 'vertical'
          }}
        ></textarea>
        <button
          onClick={submitComplaint}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Submit Complaint
        </button>
      </div>
    </div>
  );

  const renderFeedback = () => (
    <div className="dashboard-content">
      <h1 className="page-title">💬 Submit Feedback</h1>
      <div className="section-card">
        <textarea
          value={feedbackMessage}
          onChange={(e) => setFeedbackMessage(e.target.value)}
          placeholder="Write your feedback here..."
          rows={5}
          style={{
            width: '100%',
            padding: '10px',
            border: '1px solid #ddd',
            borderRadius: '5px',
            fontSize: '14px',
            resize: 'vertical'
          }}
        ></textarea>
        <button
          onClick={submitFeedback}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="dashboard-content">
      <h2 className="page-title">📋 Recent Access Logs</h2>
      <div className="section-card">
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ backgroundColor: '#f8f9fa' }}>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Action</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Time</th>
            </tr>
          </thead>
          <tbody>
            {accessLogs.length > 0 ? (
              accessLogs.map((log, i) => (
                <tr key={i}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{log.action.toUpperCase()}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(log.timestamp).toLocaleDateString()}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{new Date(log.timestamp).toLocaleTimeString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                  No access logs available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>

  );

  const renderleaves = () => (
    <div className="leave-container">
      <h2 className="leave-heading">Apply for Leave</h2>
      <form onSubmit={handleLeaveSubmit} className="leave-form">
        <input
          type="text"
          placeholder="Reason"
          value={leaveForm.reason}
          onChange={(e) => setLeaveForm({ ...leaveForm, reason: e.target.value })}
          required
          className="leave-input"
        />
        <input
          type="date"
          value={leaveForm.fromDate}
          onChange={(e) => setLeaveForm({ ...leaveForm, fromDate: e.target.value })}
          required
          className="leave-input"
        />
        <input
          type="date"
          value={leaveForm.toDate}
          onChange={(e) => setLeaveForm({ ...leaveForm, toDate: e.target.value })}
          required
          className="leave-input"
        />
        <button type="submit" className="leave-button">
          Submit Leave
        </button>
      </form>

      <h3 className="leave-subheading">Your Leave Applications</h3>
      <table className="leave-table">
        <thead>
          <tr>
            <th>From</th>
            <th>To</th>
            <th>Reason</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {studentLeaves.map((leave) => (
            <tr key={leave.id}>
              <td>{leave.fromDate}</td>
              <td>{leave.toDate}</td>
              <td>{leave.reason}</td>
              <td className={`status ${leave.status.toLowerCase()}`}>
                {leave.status}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );



  const renderContent = () => {
    switch (currentView) {
      case 'student-registration':
        return renderRegistration();
      case 'complaints':
        return renderComplaints();
      case 'feedback':
        return renderFeedback();
      case 'user-access-logs':
        return renderLogs();
      case 'leave-applications':
        return renderleaves();
      default:
        return (
          <div className="dashboard-content">
            <h1 className="page-title">{menuItems.find(item => item.id === currentView)?.label || 'Page'}</h1>
            <p>This section is under development.</p>
          </div>
        );
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
            {menuItems.map((item) => (
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

export default StudentDashboard;