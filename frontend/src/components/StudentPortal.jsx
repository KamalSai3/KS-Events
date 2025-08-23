import React, { useState, useEffect } from 'react';
import { 
  studentRegister, 
  studentLogin, 
  studentGetEvents, 
  studentRegisterEvent, 
  studentGetRegistrations, 
  studentCancelRegistration,
  getBranches,
  getSemesters,
  processPayment 
} from '../api';

const StudentPortal = () => {
  const [activeTab, setActiveTab] = useState('login');
  const [currentStudent, setCurrentStudent] = useState(null);
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [branches, setBranches] = useState([]);
  const [semesters, setSemesters] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Form states
  const [loginForm, setLoginForm] = useState({ usn: '', password: '' });
  const [registerForm, setRegisterForm] = useState({
    usn: '', name: '', email: '', password: '', confirmPassword: '', 
    phone: '', semester: '', branch: ''
  });
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);

  useEffect(() => {
    loadBranchesAndSemesters();
    if (currentStudent) {
      loadEvents();
      loadRegistrations();
    }
  }, [currentStudent]);

  const loadBranchesAndSemesters = async () => {
    try {
      const [branchesData, semestersData] = await Promise.all([
        getBranches(),
        getSemesters()
      ]);
      setBranches(branchesData);
      setSemesters(semestersData);
    } catch (error) {
      setMessage('Failed to load branches and semesters');
    }
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      const eventsData = await studentGetEvents();
      setEvents(eventsData);
    } catch (error) {
      setMessage('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  const loadRegistrations = async () => {
    if (!currentStudent) return;
    try {
      const registrationsData = await studentGetRegistrations(currentStudent.id);
      setRegistrations(registrationsData);
    } catch (error) {
      setMessage('Failed to load registrations');
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await studentLogin(loginForm);
      setCurrentStudent(response.student);
      setMessage('Login successful!');
      setActiveTab('events');
    } catch (error) {
      setMessage(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (registerForm.password !== registerForm.confirmPassword) {
      setMessage('Passwords do not match');
      return;
    }
    try {
      setLoading(true);
      const response = await studentRegister(registerForm);
      setMessage('Registration successful! Please login.');
      setActiveTab('login');
      setLoginForm({ usn: registerForm.usn, password: '' });
    } catch (error) {
      setMessage(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleEventRegistration = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await studentRegisterEvent({
        event_id: selectedEvent.id,
        student_id: currentStudent.id
      });
      setMessage('Event registration successful!');
      setShowRegistrationModal(false);
      setSelectedEvent(null);
      loadEvents();
      loadRegistrations();
    } catch (error) {
      setMessage(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelRegistration = async (registrationId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    try {
      setLoading(true);
      await studentCancelRegistration(registrationId);
      setMessage('Registration cancelled successfully!');
      loadRegistrations();
    } catch (error) {
      setMessage(error.message || 'Cancellation failed');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentStudent(null);
    setActiveTab('login');
    setMessage('Logged out successfully');
  };

  if (!currentStudent) {
    return (
      <div className="student-portal">
        <div className="portal-header">
          <h1>🎓 Student Portal</h1>
          <p>Register or login to access events</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'active' : ''}`}
            onClick={() => setActiveTab('login')}
          >
            Login
          </button>
          <button 
            className={`tab-btn ${activeTab === 'register' ? 'active' : ''}`}
            onClick={() => setActiveTab('register')}
          >
            Register
          </button>
        </div>

        {message && (
          <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
            {message}
          </div>
        )}

        {activeTab === 'login' && (
          <form onSubmit={handleLogin} className="auth-form">
            <h2>Student Login</h2>
            <div className="form-group">
              <label>USN:</label>
              <input
                type="text"
                value={loginForm.usn}
                onChange={(e) => setLoginForm({...loginForm, usn: e.target.value})}
                placeholder="Enter your USN"
                required
              />
            </div>
            <div className="form-group">
              <label>Password:</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
                placeholder="Enter your password"
                required
              />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <p className="form-note">
              Demo accounts: STU001, STU002, STU003 (password: password123)
            </p>
          </form>
        )}

        {activeTab === 'register' && (
          <form onSubmit={handleRegister} className="auth-form">
            <h2>Student Registration</h2>
            <div className="form-row">
              <div className="form-group">
                <label>USN:</label>
                <input
                  type="text"
                  value={registerForm.usn}
                  onChange={(e) => setRegisterForm({...registerForm, usn: e.target.value})}
                  placeholder="Enter your USN"
                  required
                />
              </div>
              <div className="form-group">
                <label>Name:</label>
                <input
                  type="text"
                  value={registerForm.name}
                  onChange={(e) => setRegisterForm({...registerForm, name: e.target.value})}
                  placeholder="Enter your full name"
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({...registerForm, email: e.target.value})}
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone:</label>
                <input
                  type="tel"
                  value={registerForm.phone}
                  onChange={(e) => setRegisterForm({...registerForm, phone: e.target.value})}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Semester:</label>
                <select
                  value={registerForm.semester}
                  onChange={(e) => setRegisterForm({...registerForm, semester: e.target.value})}
                  required
                >
                  <option value="">Select Semester</option>
                  {semesters.map(sem => (
                    <option key={sem} value={sem}>{sem} Semester</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Branch:</label>
                <select
                  value={registerForm.branch}
                  onChange={(e) => setRegisterForm({...registerForm, branch: e.target.value})}
                  required
                >
                  <option value="">Select Branch</option>
                  {branches.map(branch => (
                    <option key={branch} value={branch}>{branch}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={registerForm.password}
                  onChange={(e) => setRegisterForm({...registerForm, password: e.target.value})}
                  placeholder="Enter password"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirm Password:</label>
                <input
                  type="password"
                  value={registerForm.confirmPassword}
                  onChange={(e) => setRegisterForm({...registerForm, confirmPassword: e.target.value})}
                  placeholder="Confirm password"
                  required
                />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        )}
      </div>
    );
  }

  return (
    <div className="student-portal">
      <div className="portal-header">
        <h1>🎓 Student Portal</h1>
        <div className="student-info">
          <span>Welcome, {currentStudent.name} ({currentStudent.usn})</span>
          <button onClick={handleLogout} className="btn-secondary">Logout</button>
        </div>
      </div>

      <div className="portal-tabs">
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Browse Events
        </button>
        <button 
          className={`tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          My Registrations
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('successful') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {activeTab === 'events' && (
        <div className="events-section">
          <h2>Available Events</h2>
          {loading ? (
            <div className="loading">Loading events...</div>
          ) : (
            <div className="events-grid">
              {events.map(event => (
                <div key={event.id} className="event-card">
                  <div className="event-image">
                    <img src={event.image || 'https://via.placeholder.com/300x200'} alt={event.title} />
                  </div>
                  <div className="event-content">
                    <h3>{event.title}</h3>
                    <p className="event-description">{event.description}</p>
                    <div className="event-details">
                      <span>📅 {event.date}</span>
                      <span>🕒 {event.time}</span>
                      <span>📍 {event.location}</span>
                      <span>👥 {event.available_spots} spots left</span>
                                             <span className={`price ${event.price === 0 ? 'free' : ''}`}>
                         {event.price_formatted || (event.price === 0 ? 'Free' : `₹${event.price}`)}
                       </span>
                    </div>
                    <div className="event-tags">
                      {event.tags.map(tag => (
                        <span key={tag} className="tag">{tag}</span>
                      ))}
                    </div>
                    <button 
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowRegistrationModal(true);
                      }}
                      disabled={event.is_full}
                      className={`btn-primary ${event.is_full ? 'disabled' : ''}`}
                    >
                      {event.is_full ? 'Event Full' : 'Register'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'registrations' && (
        <div className="registrations-section">
          <h2>My Registrations</h2>
          {loading ? (
            <div className="loading">Loading registrations...</div>
          ) : registrations.length === 0 ? (
            <div className="no-data">No registrations found</div>
          ) : (
            <div className="registrations-list">
              {registrations.map(reg => (
                <div key={reg.id} className="registration-card">
                  <div className="registration-info">
                    <h3>{reg.event.title}</h3>
                    <p>📅 {reg.event.date} at {reg.event.time}</p>
                    <p>📍 {reg.event.location}</p>
                    <p>💰 Amount: ${reg.amount_paid}</p>
                    <p>📊 Status: {reg.payment_status}</p>
                    <p>📝 Registered: {new Date(reg.registered_at).toLocaleDateString()}</p>
                  </div>
                  <div className="registration-actions">
                    <button 
                      onClick={() => handleCancelRegistration(reg.id)}
                      className="btn-danger"
                    >
                      Cancel Registration
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Registration Modal */}
      {showRegistrationModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowRegistrationModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Register for Event</h2>
            <div className="event-summary">
              <h3>{selectedEvent.title}</h3>
              <p>{selectedEvent.description}</p>
              <div className="event-details">
                <span>📅 {selectedEvent.date}</span>
                <span>🕒 {selectedEvent.time}</span>
                <span>📍 {selectedEvent.location}</span>
                                  <span className={`price ${selectedEvent.price === 0 ? 'free' : ''}`}>
                    {selectedEvent.price_formatted || (selectedEvent.price === 0 ? 'Free' : `₹${selectedEvent.price}`)}
                  </span>
              </div>
            </div>
            <form onSubmit={handleEventRegistration}>
              <div className="form-actions">
                <button type="button" onClick={() => setShowRegistrationModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Registering...' : 'Confirm Registration'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentPortal;
