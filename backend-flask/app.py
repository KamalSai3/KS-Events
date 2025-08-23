from flask import Flask, jsonify, request
from flask_cors import CORS
from datetime import datetime, timedelta
import uuid
import re
from config import Config
from models import db, Event, Student, Registration

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    db.init_app(app)
    CORS(app)

    return app

app = create_app()

@app.get("/health")
def health():
    return jsonify({"status": "ok", "timestamp": datetime.now().isoformat()}), 200

# Student Authentication Endpoints
@app.post("/student/register")
def student_register():
    """Register a new student"""
    try:
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"status": "error", "message": "Invalid JSON"}), 400

    required_fields = ["usn", "name", "email", "password", "semester", "branch"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"status": "error", "message": f"{field} is required"}), 400

    # Validate semester (1-8)
    semester = int(data["semester"])
    if semester < 1 or semester > 8:
        return jsonify({"status": "error", "message": "Semester must be between 1 and 8"}), 400

    # Validate branch
    valid_branches = [
        "Computer Science",
        "Computer Science and Business Systems",
        "Electronics and Communication Engineering",
        "Artificial Intelligence and Data Science",
        "Mechanical Engineering",
        "Civil Engineering"
    ]
    if data["branch"] not in valid_branches:
        return jsonify({"status": "error", "message": "Invalid branch"}), 400

    try:
        # Check if USN or email already exists
        existing_student = Student.query.filter(
            (Student.usn == data["usn"]) | (Student.email == data["email"])
        ).first()
        
        if existing_student:
            return jsonify({"status": "error", "message": "USN or email already exists"}), 400

        # Create new student
        new_student = Student(
            id=data["usn"],
            usn=data["usn"].strip(),
            name=data["name"].strip(),
            email=data["email"].strip(),
            phone=data.get("phone", ""),
            semester=semester,
            branch=data["branch"],
            password_hash="",  # Will be set below
            is_active=True
        )
        new_student.set_password(data["password"])
        
        db.session.add(new_student)
        db.session.commit()
        
        return jsonify({
            "status": "success",
            "message": "Registration successful",
            "student": {
                "id": new_student.id,
                "name": new_student.name,
                "email": new_student.email,
                "usn": new_student.usn,
                "semester": new_student.semester,
                "branch": new_student.branch
            }
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.post("/student/login")
def student_login():
    """Login a student"""
    try:
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"status": "error", "message": "Invalid JSON"}), 400

    usn = data.get("usn")
    password = data.get("password")
    
    if not usn or not password:
        return jsonify({"status": "error", "message": "USN and password are required"}), 400

    try:
        student = Student.query.filter_by(usn=usn.strip()).first()
        if not student or not student.check_password(password):
            return jsonify({"status": "error", "message": "Invalid USN or password"}), 401
        
        if not student.is_active:
            return jsonify({"status": "error", "message": "Account is deactivated"}), 401
        
        return jsonify({
            "status": "success",
            "message": "Login successful",
            "student": student.to_dict()
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": "Login failed"}), 500

# Admin Portal Endpoints
@app.get("/admin/events")
def admin_get_events():
    """Get all events with registration counts for admin"""
    try:
        events = Event.query.all()
        events_with_stats = []
        
        for event in events:
            registration_count = Registration.query.filter_by(event_id=event.id).count()
            revenue = db.session.query(db.func.sum(Registration.amount_paid)).filter(
                Registration.event_id == event.id,
                Registration.payment_status == 'paid'
            ).scalar() or 0.0
            
            event_dict = event.to_dict()
            event_dict['registration_count'] = registration_count
            event_dict['revenue'] = float(revenue)
            event_dict['price_formatted'] = f"₹{event.price:.2f}" if event.price > 0 else "Free"
            events_with_stats.append(event_dict)
        
        return jsonify(events_with_stats), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.post("/admin/events")
def admin_create_event():
    """Create a new event (admin only)"""
    try:
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"status": "error", "message": "Invalid JSON"}), 400

    required_fields = ["title", "description", "date", "time", "location", "category", "capacity", "price"]
    for field in required_fields:
        if not data.get(field):
            return jsonify({"status": "error", "message": f"{field} is required"}), 400

    # Validate date format
    if not re.match(r"^\d{4}-\d{2}-\d{2}$", data["date"]):
        return jsonify({"status": "error", "message": "date must be in YYYY-MM-DD format"}), 400

    # Validate time format
    if not re.match(r"^\d{2}:\d{2}$", data["time"]):
        return jsonify({"status": "error", "message": "time must be in HH:MM format"}), 400

    try:
        # Parse date and time
        event_date = datetime.strptime(data["date"], "%Y-%m-%d").date()
        event_time = datetime.strptime(data["time"], "%H:%M").time()
        
        # Handle price - allow "free" or numeric value
        price = 0.0
        if data["price"] != "free" and data["price"] != "Free":
            try:
                price = float(data["price"])
            except ValueError:
                return jsonify({"status": "error", "message": "Invalid price format"}), 400
        
        new_event = Event(
            title=data["title"].strip(),
            description=data["description"].strip(),
            date=event_date,
            time=event_time,
            duration=data.get("duration", 2),
            location=data["location"].strip(),
            category=data["category"].strip(),
            capacity=int(data["capacity"]),
            price=price,
            image=data.get("image", ""),
            organizer=data.get("organizer", "Admin"),
            status="active",
            tags=data.get("tags", [])
        )
        
        db.session.add(new_event)
        db.session.commit()
        
        return jsonify({"status": "success", "event": new_event.to_dict()}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.put("/admin/events/<int:event_id>")
def admin_update_event(event_id):
    """Update an event (admin only)"""
    try:
        event = Event.query.get_or_404(event_id)
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"status": "error", "message": "Invalid JSON"}), 400

    # Update allowed fields
    allowed_fields = ["title", "description", "date", "time", "duration", "location", 
                     "category", "capacity", "price", "image", "organizer", "status", "tags"]
    
    try:
        for field in allowed_fields:
            if field in data:
                if field == "date" and data[field]:
                    event.date = datetime.strptime(data[field], "%Y-%m-%d").date()
                elif field == "time" and data[field]:
                    event.time = datetime.strptime(data[field], "%H:%M").time()
                elif field == "price":
                    # Handle price - allow "free" or numeric value
                    if data[field] == "free" or data[field] == "Free":
                        event.price = 0.0
                    else:
                        try:
                            event.price = float(data[field])
                        except ValueError:
                            return jsonify({"status": "error", "message": "Invalid price format"}), 400
                else:
                    setattr(event, field, data[field])
        
        db.session.commit()
        return jsonify({"status": "success", "event": event.to_dict()}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.delete("/admin/events/<int:event_id>")
def admin_delete_event(event_id):
    """Delete an event (admin only)"""
    try:
        event = Event.query.get_or_404(event_id)
        db.session.delete(event)
        db.session.commit()
        return jsonify({"status": "success", "message": "Event deleted"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.get("/admin/registrations")
def admin_get_registrations():
    """Get all registrations with event and student details"""
    try:
        registrations = Registration.query.all()
        registrations_with_details = []
        
        for reg in registrations:
            event = Event.query.get(reg.event_id)
            student = Student.query.get(reg.student_id)
            
            if event and student:
                reg_dict = reg.to_dict()
                reg_dict['event'] = event.to_dict()
                reg_dict['student'] = student.to_dict()
                reg_dict['amount_formatted'] = f"₹{reg.amount_paid:.2f}"
                registrations_with_details.append(reg_dict)
        
        return jsonify(registrations_with_details), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.get("/admin/dashboard")
def admin_dashboard():
    """Get admin dashboard statistics"""
    try:
        total_events = Event.query.count()
        total_registrations = Registration.query.count()
        total_revenue = db.session.query(db.func.sum(Registration.amount_paid)).filter(
            Registration.payment_status == 'paid'
        ).scalar() or 0.0
        
        # Upcoming events (next 30 days)
        upcoming_date = datetime.now().date() + timedelta(days=30)
        upcoming_events = Event.query.filter(
            Event.date > datetime.now().date(),
            Event.date <= upcoming_date
        ).limit(5).all()
        
        # Recent registrations (last 7 days)
        recent_date = datetime.now() - timedelta(days=7)
        recent_registrations = Registration.query.filter(
            Registration.registered_at > recent_date
        ).limit(5).all()
        
        return jsonify({
            "total_events": total_events,
            "total_registrations": total_registrations,
            "total_revenue": float(total_revenue),
            "total_revenue_formatted": f"₹{total_revenue:.2f}",
            "upcoming_events_count": Event.query.filter(
                Event.date > datetime.now().date()
            ).count(),
            "recent_registrations_count": len(recent_registrations),
            "upcoming_events": [event.to_dict() for event in upcoming_events],
            "recent_registrations": [reg.to_dict() for reg in recent_registrations]
        }), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.get("/admin/students")
def admin_get_students():
    """Get all registered students for admin"""
    try:
        students = Student.query.all()
        students_with_stats = []
        
        for student in students:
            registration_count = Registration.query.filter_by(student_id=student.id).count()
            student_dict = student.to_dict()
            student_dict['registration_count'] = registration_count
            students_with_stats.append(student_dict)
        
        return jsonify(students_with_stats), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.get("/admin/events/<int:event_id>/details")
def admin_get_event_details(event_id):
    """Get detailed event information with all registrations"""
    try:
        event = Event.query.get_or_404(event_id)
        registrations = Registration.query.filter_by(event_id=event_id).all()
        
        registrations_with_students = []
        for reg in registrations:
            student = Student.query.get(reg.student_id)
            if student:
                reg_dict = reg.to_dict()
                reg_dict['student'] = student.to_dict()
                reg_dict['amount_formatted'] = f"₹{reg.amount_paid:.2f}"
                registrations_with_students.append(reg_dict)
        
        event_dict = event.to_dict()
        event_dict['registrations'] = registrations_with_students
        event_dict['total_registrations'] = len(registrations_with_students)
        event_dict['available_spots'] = event.capacity - len(registrations_with_students)
        event_dict['price_formatted'] = f"₹{event.price:.2f}" if event.price > 0 else "Free"
        
        return jsonify(event_dict), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Student Portal Endpoints
@app.get("/student/events")
def student_get_events():
    """Get all active events for students"""
    try:
        active_events = Event.query.filter_by(status='active').all()
        events_with_availability = []
        
        for event in active_events:
            registration_count = Registration.query.filter_by(event_id=event.id).count()
            available_spots = event.capacity - registration_count
            
            event_dict = event.to_dict()
            event_dict['available_spots'] = max(0, available_spots)
            event_dict['is_full'] = available_spots <= 0
            event_dict['price_formatted'] = f"₹{event.price:.2f}" if event.price > 0 else "Free"
            events_with_availability.append(event_dict)
        
        return jsonify(events_with_availability), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.post("/student/register-event")
def student_register_event():
    """Register a student for an event"""
    try:
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"status": "error", "message": "Invalid JSON"}), 400

    event_id = data.get("event_id")
    student_id = data.get("student_id")
    
    if not event_id or not student_id:
        return jsonify({"status": "error", "message": "event_id and student_id are required"}), 400

    try:
        # Check if event exists and is active
        event = Event.query.filter_by(id=event_id, status='active').first()
        if not event:
            return jsonify({"status": "error", "message": "Event not found or inactive"}), 404

        # Check if student exists
        student = Student.query.get(student_id)
        if not student:
            return jsonify({"status": "error", "message": "Student not found"}), 404

        # Check if already registered
        existing_registration = Registration.query.filter_by(
            event_id=event_id, student_id=student_id
        ).first()
        if existing_registration:
            return jsonify({"status": "error", "message": "Already registered for this event"}), 400

        # Check capacity
        registration_count = Registration.query.filter_by(event_id=event_id).count()
        if registration_count >= event.capacity:
            return jsonify({"status": "error", "message": "Event is full"}), 400

        # Create registration
        registration = Registration(
            event_id=event_id,
            student_id=student_id,
            amount_paid=event.price,
            payment_status='pending' if event.price > 0 else 'paid',
            payment_method=data.get("payment_method", "card"),
            special_requirements=data.get("special_requirements", "")
        )
        
        # Simulate payment processing for paid events
        if event.price > 0:
            registration.payment_status = 'paid'
            registration.transaction_id = f"TXN_{uuid.uuid4().hex[:8].upper()}"
        
        db.session.add(registration)
        db.session.commit()
        
        return jsonify({
            "status": "success", 
            "registration": registration.to_dict(),
            "event": event.to_dict(),
            "student": student.to_dict()
        }), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

@app.get("/student/registrations/<student_id>")
def student_get_registrations(student_id):
    """Get all registrations for a specific student"""
    try:
        registrations = Registration.query.filter_by(student_id=student_id).all()
        registrations_with_events = []
        
        for reg in registrations:
            event = Event.query.get(reg.event_id)
            if event:
                reg_dict = reg.to_dict()
                reg_dict['event'] = event.to_dict()
                registrations_with_events.append(reg_dict)
        
        return jsonify(registrations_with_events), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.delete("/student/registrations/<registration_id>")
def student_cancel_registration(registration_id):
    """Cancel a registration"""
    try:
        registration = Registration.query.get_or_404(registration_id)
        
        # Check if event is within 24 hours (no cancellation)
        event = Event.query.get(registration.event_id)
        if event:
            event_datetime = datetime.combine(event.date, event.time)
            if event_datetime - datetime.now() < timedelta(hours=24):
                return jsonify({"status": "error", "message": "Cannot cancel within 24 hours of event"}), 400

        db.session.delete(registration)
        db.session.commit()
        return jsonify({"status": "success", "message": "Registration cancelled"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"status": "error", "message": str(e)}), 500

# Public API Endpoints
@app.get("/events")
def get_events():
    """Get all active events (public)"""
    try:
        active_events = Event.query.filter_by(status='active').all()
        events_with_prices = []
        
        for event in active_events:
            event_dict = event.to_dict()
            event_dict['price_formatted'] = f"₹{event.price:.2f}" if event.price > 0 else "Free"
            events_with_prices.append(event_dict)
        
        return jsonify(events_with_prices), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.get("/events/<int:event_id>")
def get_event(event_id):
    """Get specific event details"""
    try:
        event = Event.query.get_or_404(event_id)
        registration_count = Registration.query.filter_by(event_id=event_id).count()
        available_spots = event.capacity - registration_count
        
        event_dict = event.to_dict()
        event_dict['available_spots'] = max(0, available_spots)
        event_dict['is_full'] = available_spots <= 0
        event_dict['price_formatted'] = f"₹{event.price:.2f}" if event.price > 0 else "Free"
        
        return jsonify(event_dict), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.get("/categories")
def get_categories():
    """Get all event categories"""
    try:
        categories = db.session.query(Event.category).distinct().all()
        return jsonify([cat[0] for cat in categories]), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

@app.get("/branches")
def get_branches():
    """Get all available branches"""
    branches = [
        "Computer Science",
        "Computer Science and Business Systems",
        "Electronics and Communication Engineering",
        "Artificial Intelligence and Data Science",
        "Mechanical Engineering",
        "Civil Engineering"
    ]
    return jsonify(branches), 200

@app.get("/semesters")
def get_semesters():
    """Get all available semesters"""
    semesters = list(range(1, 9))  # 1 to 8
    return jsonify(semesters), 200

@app.get("/students")
def get_students():
    """Get all students (for demo purposes)"""
    try:
        students = Student.query.all()
        return jsonify([student.to_dict() for student in students]), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# Payment simulation endpoint
@app.post("/payment/process")
def process_payment():
    """Simulate payment processing"""
    try:
        data = request.get_json(force=True) or {}
    except Exception:
        return jsonify({"status": "error", "message": "Invalid JSON"}), 400

    amount = data.get("amount", 0)
    payment_method = data.get("payment_method", "card")
    
    # Simulate payment processing
    if amount > 0:
        # In a real app, this would integrate with payment gateways
        transaction_id = f"TXN_{uuid.uuid4().hex[:8].upper()}"
        return jsonify({
            "status": "success",
            "transaction_id": transaction_id,
            "amount": amount,
            "payment_method": payment_method,
            "processed_at": datetime.now().isoformat()
        }), 200
    else:
        return jsonify({
            "status": "success",
            "transaction_id": None,
            "amount": 0,
            "payment_method": "free",
            "processed_at": datetime.now().isoformat()
        }), 200

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(host="0.0.0.0", port=5000, debug=True)
