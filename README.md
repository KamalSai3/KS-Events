# KS Events - Advanced Event Management System

A modern, professional event management system built with React frontend and Flask backend, featuring admin and student portals with payment integration.

## 🚀 Features

# KS Events

KS Events is a full-stack event management application built for institutions and communities to create, publish, and manage events. It includes an Admin portal for event organizers, a Student portal for attendees to browse and register, and a public-facing site for discovery.

## Key Highlights

- Admin portal with event CRUD, registration tracking and revenue reporting
- Student portal for browsing events, registering, and managing registrations
- Public interface for event discovery with search and category filters
- Simulated payment flow for paid events (can be swapped for a real gateway)
- Built with React (Vite) frontend and Flask backend with SQLAlchemy

## Features

- Dashboard and analytics for admins
- Event categories, detailed event pages, and media/image support
- Registration management with payment status
- Responsive UI and modern design

## Technology Stack

- Frontend: React 18, Vite, React Router
- Backend: Flask, Flask-CORS, SQLAlchemy
- Database: PostgreSQL (development can use SQLite)
- Dev tooling: Node.js, npm, Python 3.8+

## Quickstart (Development)

Follow these steps to run the project locally.

1) Clone the repository (if you haven't already):

```powershell
git clone https://github.com/KamalSai3/KS_Events.git
cd "KS-Events"
```

2) Backend setup

```powershell
cd backend-flask
python -m venv venv
venv\Scripts\activate   # Windows
pip install -r requirements.txt
# Configure DB connection in config.py (default uses PostgreSQL)
python init_db.py        # create or initialize the database
python app.py            # or: flask run
```

The backend will run at: http://localhost:5000

3) Frontend setup (in a separate terminal)

```powershell
cd frontend
npm install
npm run dev
```

The frontend dev server will run at: http://localhost:5173

## Configuration

- Backend settings are in `backend-flask/config.py` (database URL, CORS, secrets).
- To switch databases, update the SQLALCHEMY_DATABASE_URI.

## Deployment Notes

- Use PostgreSQL in production and set proper environment variables for DB credentials.
- Consider using a real payment gateway (Stripe/PayPal) instead of the simulated payment flow.
- Containerize with Docker for easier deployment.

## Contributing

Contributions are welcome. Recommended workflow:

1. Fork the repo
2. Create a feature branch: `git checkout -b feat/your-feature`
3. Commit changes and open a pull request

Please include tests for new features where appropriate.

## License

This project is provided under the MIT License. Update `LICENSE` file as needed.

## Contact

Owner: Kamal Sai — https://github.com/KamalSai3

If you'd like, I can also commit this README change and push it to `origin/main`. Reply "push" and I'll finish the commit & push step for you.
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
