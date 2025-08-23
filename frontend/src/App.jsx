import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom'
import { useState, useEffect } from 'react'
import AdminPortal from './components/AdminPortal'
import StudentPortal from './components/StudentPortal'
import PublicEvents from './components/PublicEvents'
import './styles.css'

function Navigation() {
  const location = useLocation()
  
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-brand">
          <h1>KS Events</h1>
          <span className="nav-subtitle">Event Management System</span>
        </div>
        
        <div className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <i className="icon">🏠</i>
            Public Events
          </Link>
          <Link 
            to="/admin" 
            className={`nav-link ${location.pathname.startsWith('/admin') ? 'active' : ''}`}
          >
            <i className="icon">⚙️</i>
            Admin Portal
          </Link>
          <Link 
            to="/student" 
            className={`nav-link ${location.pathname.startsWith('/student') ? 'active' : ''}`}
          >
            <i className="icon">👨‍🎓</i>
            Student Portal
          </Link>
        </div>
      </div>
    </nav>
  )
}

function App() {
  const [apiStatus, setApiStatus] = useState('checking')

  useEffect(() => {
    const checkApi = async () => {
      try {
        const { healthCheck } = await import('./api')
        await healthCheck()
        setApiStatus('connected')
      } catch (error) {
        console.error('API connection failed:', error)
        setApiStatus('disconnected')
      }
    }
    
    checkApi()
  }, [])

  return (
    <Router>
      <div className="app">
        <Navigation />
        
        {apiStatus === 'disconnected' && (
          <div className="api-warning">
            <div className="warning-content">
              <i className="warning-icon">⚠️</i>
              <div>
                <h3>API Connection Failed</h3>
                <p>Unable to connect to the backend server. Please ensure the Flask server is running on port 5000.</p>
                <button onClick={() => window.location.reload()} className="retry-btn">
                  Retry Connection
                </button>
              </div>
            </div>
          </div>
        )}
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<PublicEvents />} />
            <Route path="/admin/*" element={<AdminPortal />} />
            <Route path="/student/*" element={<StudentPortal />} />
          </Routes>
        </main>
        
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section">
              <h4>KS Events</h4>
              <p>Professional event management system for educational institutions</p>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <Link to="/">Public Events</Link>
              <Link to="/admin">Admin Portal</Link>
              <Link to="/student">Student Portal</Link>
            </div>
            <div className="footer-section">
              <h4>API Status</h4>
              <div className={`status-indicator ${apiStatus}`}>
                {apiStatus === 'connected' ? '🟢 Connected' : 
                 apiStatus === 'disconnected' ? '🔴 Disconnected' : '🟡 Checking...'}
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 KS Events. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App