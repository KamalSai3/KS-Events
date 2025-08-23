// Generic API call helper
const apiCall = async (endpoint, options = {}) => {
  const baseUrl = 'http://localhost:5000';
  const url = `${baseUrl}${endpoint}`;
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  };
  
  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Health check
export const healthCheck = () => apiCall('/health');

// Public API endpoints
export const getEvents = () => apiCall('/events');
export const getEvent = (id) => apiCall(`/events/${id}`);
export const getCategories = () => apiCall('/categories');
export const getStudents = () => apiCall('/students');
export const getBranches = () => apiCall('/branches');
export const getSemesters = () => apiCall('/semesters');

// Admin API endpoints
export const adminGetEvents = () => apiCall('/admin/events');
export const adminCreateEvent = (eventData) => apiCall('/admin/events', {
  method: 'POST',
  body: JSON.stringify(eventData),
});
export const adminUpdateEvent = (id, eventData) => apiCall(`/admin/events/${id}`, {
  method: 'PUT',
  body: JSON.stringify(eventData),
});
export const adminDeleteEvent = (id) => apiCall(`/admin/events/${id}`, {
  method: 'DELETE',
});
export const adminGetRegistrations = () => apiCall('/admin/registrations');
export const adminGetDashboard = () => apiCall('/admin/dashboard');
export const adminGetStudents = () => apiCall('/admin/students');
export const adminGetEventDetails = (id) => apiCall(`/admin/events/${id}/details`);

// Student API endpoints
export const studentRegister = (studentData) => apiCall('/student/register', {
  method: 'POST',
  body: JSON.stringify(studentData),
});
export const studentLogin = (credentials) => apiCall('/student/login', {
  method: 'POST',
  body: JSON.stringify(credentials),
});
export const studentGetEvents = () => apiCall('/student/events');
export const studentRegisterEvent = (registrationData) => apiCall('/student/register-event', {
  method: 'POST',
  body: JSON.stringify(registrationData),
});
export const studentGetRegistrations = (studentId) => apiCall(`/student/registrations/${studentId}`);
export const studentCancelRegistration = (registrationId) => apiCall(`/student/registrations/${registrationId}`, {
  method: 'DELETE',
});

// Payment API endpoints
export const processPayment = (paymentData) => apiCall('/payment/process', {
  method: 'POST',
  body: JSON.stringify(paymentData),
});