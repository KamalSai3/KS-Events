import React, { useState, useEffect } from 'react';
import { 
  adminGetEvents, 
  adminCreateEvent, 
  adminUpdateEvent, 
  adminDeleteEvent, 
  adminGetRegistrations, 
  adminGetDashboard,
  adminGetStudents,
  adminGetEventDetails
} from '../api';

const AdminPortal = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [events, setEvents] = useState([]);
  const [registrations, setRegistrations] = useState([]);
  const [students, setStudents] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showEventModal, setShowEventModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showEventDetailsModal, setShowEventDetailsModal] = useState(false);

  // Form state
  const [eventForm, setEventForm] = useState({
    title: '', description: '', date: '', time: '', duration: 2,
    location: '', category: '', capacity: '', price: '', image: '', organizer: '', tags: []
  });

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    try {
      setLoading(true);
      switch (activeTab) {
        case 'dashboard':
          const dashboardData = await adminGetDashboard();
          setDashboard(dashboardData);
          break;
        case 'events':
          const eventsData = await adminGetEvents();
          setEvents(eventsData);
          break;
        case 'registrations':
          const registrationsData = await adminGetRegistrations();
          setRegistrations(registrationsData);
          break;
        case 'students':
          const studentsData = await adminGetStudents();
          setStudents(studentsData);
          break;
        default:
          break;
      }
    } catch (error) {
      setMessage(error.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = () => {
    setEditingEvent(null);
    setEventForm({
      title: '', description: '', date: '', time: '', duration: 2,
      location: '', category: '', capacity: '', price: '', image: '', organizer: '', tags: []
    });
    setShowEventModal(true);
  };

  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEventForm({
      title: event.title,
      description: event.description,
      date: event.date,
      time: event.time,
      duration: event.duration,
      location: event.location,
      category: event.category,
      capacity: event.capacity,
      price: event.price === 0 ? 'free' : event.price.toString(),
      image: event.image || '',
      organizer: event.organizer || '',
      tags: event.tags || []
    });
    setShowEventModal(true);
  };

  const handleEventSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (editingEvent) {
        await adminUpdateEvent(editingEvent.id, eventForm);
        setMessage('Event updated successfully!');
      } else {
        await adminCreateEvent(eventForm);
        setMessage('Event created successfully!');
      }
      setShowEventModal(false);
      setEditingEvent(null);
      loadData();
    } catch (error) {
      setMessage(error.message || 'Failed to save event');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      setLoading(true);
      await adminDeleteEvent(eventId);
      setMessage('Event deleted successfully!');
      loadData();
    } catch (error) {
      setMessage(error.message || 'Failed to delete event');
    } finally {
      setLoading(false);
    }
  };

  const handleViewEventDetails = async (eventId) => {
    try {
      setLoading(true);
      const eventDetails = await adminGetEventDetails(eventId);
      setSelectedEvent(eventDetails);
      setShowEventDetailsModal(true);
    } catch (error) {
      setMessage(error.message || 'Failed to load event details');
    } finally {
      setLoading(false);
    }
  };

  const handleTagInput = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newTag = e.target.value.trim();
      if (!eventForm.tags.includes(newTag)) {
        setEventForm({ ...eventForm, tags: [...eventForm.tags, newTag] });
      }
      e.target.value = '';
    }
  };

  const removeTag = (tagToRemove) => {
    setEventForm({ ...eventForm, tags: eventForm.tags.filter(tag => tag !== tagToRemove) });
  };

  return (
    <div className="admin-portal">
      <div className="portal-header">
        <h1>⚙️ Admin Portal</h1>
        <p>Manage events, registrations, and students</p>
      </div>

      <div className="portal-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'events' ? 'active' : ''}`}
          onClick={() => setActiveTab('events')}
        >
          Events
        </button>
        <button 
          className={`tab-btn ${activeTab === 'registrations' ? 'active' : ''}`}
          onClick={() => setActiveTab('registrations')}
        >
          Registrations
        </button>
        <button 
          className={`tab-btn ${activeTab === 'students' ? 'active' : ''}`}
          onClick={() => setActiveTab('students')}
        >
          Students
        </button>
      </div>

      {message && (
        <div className={`message ${message.includes('successfully') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Dashboard Tab */}
      {activeTab === 'dashboard' && (
        <div className="dashboard-section">
          <h2>System Overview</h2>
          {loading ? (
            <div className="loading">Loading dashboard...</div>
          ) : dashboard ? (
            <div className="dashboard-grid">
              <div className="stat-card">
                <h3>Total Events</h3>
                <div className="stat-value">{dashboard.total_events}</div>
              </div>
              <div className="stat-card">
                <h3>Total Registrations</h3>
                <div className="stat-value">{dashboard.total_registrations}</div>
              </div>
              <div className="stat-card">
                <h3>Total Revenue</h3>
                                 <div className="stat-value">{dashboard.total_revenue_formatted || `₹${dashboard.total_revenue}`}</div>
              </div>
              <div className="stat-card">
                <h3>Upcoming Events</h3>
                <div className="stat-value">{dashboard.upcoming_events_count}</div>
              </div>
            </div>
          ) : (
            <div className="no-data">No dashboard data available</div>
          )}
        </div>
      )}

      {/* Events Tab */}
      {activeTab === 'events' && (
        <div className="events-section">
          <div className="section-header">
            <h2>Event Management</h2>
            <button onClick={handleCreateEvent} className="btn-primary">
              Create New Event
            </button>
          </div>
          
          {loading ? (
            <div className="loading">Loading events...</div>
          ) : (
            <div className="events-table">
              <table>
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Date</th>
                    <th>Location</th>
                    <th>Category</th>
                    <th>Capacity</th>
                    <th>Price</th>
                    <th>Registrations</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {events.map(event => (
                    <tr key={event.id}>
                      <td>{event.title}</td>
                      <td>{event.date}</td>
                      <td>{event.location}</td>
                      <td>{event.category}</td>
                      <td>{event.capacity}</td>
                                             <td>{event.price_formatted || (event.price === 0 ? 'Free' : `₹${event.price}`)}</td>
                      <td>{event.registration_count}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            onClick={() => handleViewEventDetails(event.id)}
                            className="btn-secondary btn-sm"
                          >
                            View Details
                          </button>
                          <button 
                            onClick={() => handleEditEvent(event)}
                            className="btn-primary btn-sm"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteEvent(event.id)}
                            className="btn-danger btn-sm"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Registrations Tab */}
      {activeTab === 'registrations' && (
        <div className="registrations-section">
          <h2>All Registrations</h2>
          {loading ? (
            <div className="loading">Loading registrations...</div>
          ) : (
            <div className="registrations-table">
              <table>
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Event</th>
                    <th>Date</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Registered</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map(reg => (
                    <tr key={reg.id}>
                      <td>{reg.student.name} ({reg.student.usn})</td>
                      <td>{reg.event.title}</td>
                      <td>{reg.event.date}</td>
                      <td>₹{reg.amount_paid}</td>
                      <td>
                        <span className={`status ${reg.payment_status}`}>
                          {reg.payment_status}
                        </span>
                      </td>
                      <td>{new Date(reg.registered_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Students Tab */}
      {activeTab === 'students' && (
        <div className="students-section">
          <h2>Registered Students</h2>
          {loading ? (
            <div className="loading">Loading students...</div>
          ) : (
            <div className="students-table">
              <table>
                <thead>
                  <tr>
                    <th>USN</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Semester</th>
                    <th>Branch</th>
                    <th>Registrations</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map(student => (
                    <tr key={student.id}>
                      <td>{student.usn}</td>
                      <td>{student.name}</td>
                      <td>{student.email}</td>
                      <td>{student.phone || '-'}</td>
                      <td>{student.semester} Semester</td>
                      <td>{student.branch}</td>
                      <td>{student.registration_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Event Modal */}
      {showEventModal && (
        <div className="modal-overlay" onClick={() => setShowEventModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>{editingEvent ? 'Edit Event' : 'Create New Event'}</h2>
            <form onSubmit={handleEventSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Title:</label>
                  <input
                    type="text"
                    value={eventForm.title}
                    onChange={(e) => setEventForm({...eventForm, title: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Category:</label>
                  <input
                    type="text"
                    value={eventForm.category}
                    onChange={(e) => setEventForm({...eventForm, category: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={eventForm.description}
                  onChange={(e) => setEventForm({...eventForm, description: e.target.value})}
                  required
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date:</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({...eventForm, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time:</label>
                  <input
                    type="time"
                    value={eventForm.time}
                    onChange={(e) => setEventForm({...eventForm, time: e.target.value})}
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Duration (hours):</label>
                  <input
                    type="number"
                    value={eventForm.duration}
                    onChange={(e) => setEventForm({...eventForm, duration: parseInt(e.target.value)})}
                    min="1"
                    max="24"
                  />
                </div>
                <div className="form-group">
                  <label>Capacity:</label>
                  <input
                    type="number"
                    value={eventForm.capacity}
                    onChange={(e) => setEventForm({...eventForm, capacity: e.target.value})}
                    required
                    min="1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Location:</label>
                  <input
                    type="text"
                    value={eventForm.location}
                    onChange={(e) => setEventForm({...eventForm, location: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Price:</label>
                  <input
                    type="text"
                    value={eventForm.price}
                    onChange={(e) => setEventForm({...eventForm, price: e.target.value})}
                    placeholder="Enter amount or 'free'"
                    required
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Image URL:</label>
                  <input
                    type="url"
                    value={eventForm.image}
                    onChange={(e) => setEventForm({...eventForm, image: e.target.value})}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                <div className="form-group">
                  <label>Organizer:</label>
                  <input
                    type="text"
                    value={eventForm.organizer}
                    onChange={(e) => setEventForm({...eventForm, organizer: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Tags:</label>
                <input
                  type="text"
                  placeholder="Press Enter to add tags"
                  onKeyPress={handleTagInput}
                />
                <div className="tags-container">
                  {eventForm.tags.map(tag => (
                    <span key={tag} className="tag">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)}>×</button>
                    </span>
                  ))}
                </div>
              </div>
              <div className="form-actions">
                <button type="button" onClick={() => setShowEventModal(false)} className="btn-secondary">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className="btn-primary">
                  {loading ? 'Saving...' : (editingEvent ? 'Update Event' : 'Create Event')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {showEventDetailsModal && selectedEvent && (
        <div className="modal-overlay" onClick={() => setShowEventDetailsModal(false)}>
          <div className="modal large" onClick={e => e.stopPropagation()}>
            <h2>Event Details: {selectedEvent.title}</h2>
            <div className="event-details-content">
              <div className="event-info">
                <div className="event-image">
                  <img src={selectedEvent.image || 'https://via.placeholder.com/400x250'} alt={selectedEvent.title} />
                </div>
                <div className="event-meta">
                  <p><strong>Description:</strong> {selectedEvent.description}</p>
                  <p><strong>Date:</strong> {selectedEvent.date} at {selectedEvent.time}</p>
                  <p><strong>Duration:</strong> {selectedEvent.duration} hours</p>
                  <p><strong>Location:</strong> {selectedEvent.location}</p>
                  <p><strong>Category:</strong> {selectedEvent.category}</p>
                  <p><strong>Capacity:</strong> {selectedEvent.capacity} people</p>
                                     <p><strong>Price:</strong> {selectedEvent.price_formatted || (selectedEvent.price === 0 ? 'Free' : `₹${selectedEvent.price}`)}</p>
                  <p><strong>Organizer:</strong> {selectedEvent.organizer}</p>
                  <p><strong>Status:</strong> {selectedEvent.status}</p>
                  <p><strong>Available Spots:</strong> {selectedEvent.available_spots}</p>
                  <p><strong>Total Registrations:</strong> {selectedEvent.total_registrations}</p>
                </div>
              </div>
              
              <div className="registrations-list">
                <h3>Registrations ({selectedEvent.total_registrations})</h3>
                {selectedEvent.registrations.length === 0 ? (
                  <p>No registrations yet</p>
                ) : (
                  <div className="registrations-table">
                    <table>
                      <thead>
                        <tr>
                          <th>Student</th>
                          <th>USN</th>
                          <th>Branch</th>
                          <th>Semester</th>
                          <th>Amount Paid</th>
                          <th>Status</th>
                          <th>Registered</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedEvent.registrations.map(reg => (
                          <tr key={reg.id}>
                            <td>{reg.student.name}</td>
                            <td>{reg.student.usn}</td>
                            <td>{reg.student.branch}</td>
                            <td>{reg.student.semester} Semester</td>
                            <td>{reg.amount_formatted || `₹${reg.amount_paid}`}</td>
                            <td>
                              <span className={`status ${reg.payment_status}`}>
                                {reg.payment_status}
                              </span>
                            </td>
                            <td>{new Date(reg.registered_at).toLocaleDateString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
            <div className="form-actions">
              <button onClick={() => setShowEventDetailsModal(false)} className="btn-secondary">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPortal;
