import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getEvents, getCategories } from '../api'

export default function PublicEvents() {
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        const [eventsData, categoriesData] = await Promise.all([
          getEvents(),
          getCategories()
        ])
        setEvents(eventsData)
        setCategories(categoriesData)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  const filteredEvents = events.filter(event => {
    const matchesCategory = selectedCategory === 'all' || event.category === selectedCategory
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        Loading events...
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-message">
        <h3>Error loading events</h3>
        <p>{error}</p>
        <button className="btn btn-primary" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div>
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Welcome to KS Events</h1>
          <p>Discover amazing events happening on campus. From technology workshops to cultural festivals, there's something for everyone.</p>
          <div className="hero-actions">
            <Link to="/student" className="btn btn-primary btn-lg">
              Register for Events
            </Link>
            <Link to="/admin" className="btn btn-outline btn-lg">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-3">
        <div className="filters">
          <div className="search-box">
            <input
              type="text"
              className="form-input"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="category-filters">
            <button
              className={`filter-btn ${selectedCategory === 'all' ? 'active' : ''}`}
              onClick={() => setSelectedCategory('all')}
            >
              All Events
            </button>
            {categories.map(category => (
              <button
                key={category}
                className={`filter-btn ${selectedCategory === category ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Events Grid */}
      <div className="events-header">
        <h2>Upcoming Events</h2>
        <p className="text-muted">
          Showing {filteredEvents.length} of {events.length} events
        </p>
      </div>

      {filteredEvents.length === 0 ? (
        <div className="card">
          <div className="text-center">
            <h3>No Events Found</h3>
            <p className="text-muted">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'No events are currently available.'
              }
            </p>
            {(searchTerm || selectedCategory !== 'all') && (
              <button 
                className="btn btn-primary"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
              >
                Clear Filters
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-3">
          {filteredEvents.map(event => (
            <div key={event.id} className="event-card">
              {event.image && (
                <img src={event.image} alt={event.title} className="event-image" />
              )}
              <div className="event-content">
                <div className="event-category">
                  <span className="badge badge-info">{event.category}</span>
                </div>
                
                <h3 className="event-title">{event.title}</h3>
                <p className="event-description">{event.description}</p>
                
                <div className="event-meta">
                  <div className="event-meta-item">
                    <span>📅</span>
                    {event.date} at {event.time}
                  </div>
                  <div className="event-meta-item">
                    <span>📍</span>
                    {event.location}
                  </div>
                  <div className="event-meta-item">
                    <span>⏱️</span>
                    {event.duration} hours
                  </div>
                  <div className="event-meta-item">
                    <span>👥</span>
                    {event.capacity} capacity
                  </div>
                </div>

                <div className="event-price">
                  {event.price_formatted || (event.price > 0 ? `₹${event.price.toFixed(2)}` : 'Free')}
                </div>

                <div className="event-actions">
                  <Link to="/student" className="btn btn-primary">
                    Register Now
                  </Link>
                  <button className="btn btn-outline">
                    Learn More
                  </button>
                </div>

                {event.tags && event.tags.length > 0 && (
                  <div className="event-tags">
                    {event.tags.map(tag => (
                      <span key={tag} className="tag">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Call to Action */}
      <div className="card mt-4">
        <div className="text-center">
          <h3>Ready to Join?</h3>
          <p className="text-muted">
            Create an account or log in to register for events and manage your registrations.
          </p>
          <div className="flex gap-2 justify-center">
            <Link to="/student" className="btn btn-primary">
              Student Portal
            </Link>
            <Link to="/admin" className="btn btn-outline">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
