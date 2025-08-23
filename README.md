# KS Events - Advanced Event Management System

A modern, professional event management system built with React frontend and Flask backend, featuring admin and student portals with payment integration.

## 🚀 Features

### Admin Portal
- **Dashboard**: Real-time statistics and overview
- **Event Management**: Create, edit, delete events with rich details
- **Registration Tracking**: View all registrations with payment status
- **Revenue Analytics**: Track earnings from paid events
- **Event Categories**: Organize events by type (Technology, Cultural, Career, etc.)

### Student Portal
- **Event Browsing**: View all available events with filtering
- **Registration System**: Easy event registration with payment processing
- **Registration Management**: View and cancel registrations
- **Payment Integration**: Simulated payment gateway for paid events
- **Student Profiles**: Multiple student accounts for testing

### Public Interface
- **Event Discovery**: Beautiful public-facing event showcase
- **Search & Filter**: Find events by category or keyword
- **Responsive Design**: Works on all devices
- **Professional UI**: Modern dark theme with smooth animations

## 🛠️ Technology Stack

### Backend
- **Flask**: Python web framework
- **Flask-CORS**: Cross-origin resource sharing
- **PostgreSQL**: Production-ready database with SQLAlchemy ORM
- **SQLAlchemy**: Database ORM for Python

### Frontend
- **React 18**: Modern React with hooks
- **React Router**: Client-side routing
- **Vite**: Fast build tool and dev server
- **CSS3**: Custom styling with CSS variables and modern features

## 📦 Installation & Setup

### Prerequisites
- Node.js 16+ and npm
- Python 3.8+
- Git

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend-flask
   ```

2. **Create virtual environment:**
   ```bash
   python -m venv venv
   ```

3. **Activate virtual environment:**
   - Windows: `venv\Scripts\activate`
   - macOS/Linux: `source venv/bin/activate`

4. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

5. **Database Setup:**
   The application is configured to use a PostgreSQL database. The connection string is set in `config.py`.
   
   To initialize the database with sample data:
   ```bash
   python init_db.py
   ```

6. **Run the Flask server:**
   ```bash
   python app.py
   ```
   The backend will be available at `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 🎯 Usage Guide

### Admin Portal (`/admin`)
1. **Dashboard**: View system overview, total events, registrations, and revenue
2. **Events**: Create new events with detailed information
   - Title, description, date, time, location
   - Capacity, pricing, categories, tags
   - Image URLs, organizer details
3. **Registrations**: Monitor all student registrations and payment status

### Student Portal (`/student`)
1. **Browse Events**: View available events with real-time availability
2. **Register**: Select events and complete registration
3. **Payment**: Simulated payment processing for paid events
4. **Manage Registrations**: View and cancel existing registrations

### Public Events (`/`)
- Browse all active events
- Search and filter by category
- View event details and pricing

## 🔧 API Endpoints

### Public Endpoints
- `GET /events` - Get all active events
- `GET /events/{id}` - Get specific event details
- `GET /categories` - Get all event categories
- `GET /students` - Get student list (demo)

### Admin Endpoints
- `GET /admin/dashboard` - Admin dashboard statistics
- `GET /admin/events` - Get all events with registration counts
- `POST /admin/events` - Create new event
- `PUT /admin/events/{id}` - Update event
- `DELETE /admin/events/{id}` - Delete event
- `GET /admin/registrations` - Get all registrations

### Student Endpoints
- `GET /student/events` - Get events with availability info
- `POST /student/register` - Register for an event
- `GET /student/registrations/{student_id}` - Get student registrations
- `DELETE /student/registrations/{id}` - Cancel registration

### Payment Endpoints
- `POST /payment/process` - Simulate payment processing

## 🎨 UI Features

### Design System
- **Dark Theme**: Professional dark color scheme
- **Responsive**: Mobile-first responsive design
- **Animations**: Smooth transitions and hover effects
- **Typography**: Modern font stack with proper hierarchy
- **Icons**: Emoji icons for visual appeal

### Components
- **Cards**: Event cards with images and details
- **Modals**: Registration and payment modals
- **Tables**: Data tables for admin views
- **Forms**: Comprehensive form components
- **Navigation**: Clean navigation with active states

## 🗄️ Database

### PostgreSQL Integration
The application uses PostgreSQL as the primary database with SQLAlchemy ORM for data management.

### Database Schema
- **Events Table**: Stores event information (title, description, date, time, location, etc.)
- **Students Table**: Stores student profiles and information
- **Registrations Table**: Tracks event registrations with payment status

### Database Features
- **Relationships**: Proper foreign key relationships between tables
- **Data Validation**: SQLAlchemy model validation
- **Transaction Support**: ACID compliance for data integrity
- **Connection Pooling**: Optimized database connections
- **JSON Support**: Tags stored as JSON arrays

## 🔒 Security & Data

### Current Implementation
- PostgreSQL database with SQLAlchemy ORM
- Simulated payment processing
- No authentication (demo mode)
- Production-ready database schema

### Production Considerations
- Add proper authentication (JWT, OAuth)
- Integrate real payment gateways (Stripe, PayPal)
- Add input validation and sanitization
- Implement rate limiting and CORS policies
- Add logging and monitoring
- Set up database backups and monitoring

## 📱 Demo Data

The system comes with sample data:

### Sample Events
- Tech Innovation Summit 2025
- Cultural Diversity Festival
- Career Fair 2025

### Sample Students
- John Doe (Computer Science, Junior)
- Jane Smith (Business Administration, Senior)

## 🚀 Deployment

### Backend Deployment
```bash
# Using Gunicorn (production)
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Frontend Deployment
```bash
# Build for production
npm run build

# Serve static files with nginx or similar
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the documentation
2. Review existing issues
3. Create a new issue with detailed information

## 🔮 Future Enhancements

- User authentication and authorization
- Email notifications
- Calendar integration
- QR code check-in
- Advanced analytics
- Multi-language support
- Mobile app
- Social media integration
- Event templates
- Bulk operations

---

**Built with ❤️ for educational institutions and event organizers**
