from app import create_app, db
from models import Event, Student, Registration
from datetime import datetime, date, time
import uuid

def init_database():
    app = create_app()

    with app.app_context():
        db.create_all()

        if Event.query.first() is None:
            print("Creating sample events...")
            
            # Create sample events
            events = [
                Event(
                    title="Tech Innovation Summit 2025",
                    description="Join us for a day of cutting-edge technology discussions, workshops, and networking opportunities.",
                    date=date(2025, 3, 15),
                    time=time(9, 0),
                    duration=8,
                    location="Main Auditorium",
                    category="Technology",
                    capacity=200,
                    price=1500.00,  # ₹1500
                    image="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500",
                    organizer="Tech Club",
                    status="active",
                    tags=["Technology", "Innovation", "Networking"]
                ),
                Event(
                    title="Cultural Diversity Festival",
                    description="Celebrate the rich cultural diversity of our campus with performances, food, and activities.",
                    date=date(2025, 4, 20),
                    time=time(14, 0),
                    duration=6,
                    location="Campus Grounds",
                    category="Cultural",
                    capacity=500,
                    price=0.00,  # Free
                    image="https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=500",
                    organizer="Cultural Committee",
                    status="active",
                    tags=["Cultural", "Festival", "Diversity"]
                ),
                Event(
                    title="Career Fair 2025",
                    description="Connect with top companies and explore internship and job opportunities.",
                    date=date(2025, 5, 10),
                    time=time(10, 0),
                    duration=7,
                    location="Conference Center",
                    category="Career",
                    capacity=300,
                    price=800.00,  # ₹800
                    image="https://images.unsplash.com/photo-1552664730-d307ca884978?w=500",
                    organizer="Career Services",
                    status="active",
                    tags=["Career", "Networking", "Jobs"]
                )
            ]
            
            for event in events:
                db.session.add(event)
            
            print("Creating sample students...")
            
            # Create sample students
            students = [
                Student(
                    id="STU001",
                    usn="1MS22CS001",
                    name="John Doe",
                    email="john.doe@example.com",
                    phone="+1-555-0123",
                    semester=5,
                    branch="Computer Science",
                    password_hash="",  # Will be set below
                    is_active=True
                ),
                Student(
                    id="STU002",
                    usn="1MS22CS002",
                    name="Jane Smith",
                    email="jane.smith@example.com",
                    phone="+1-555-0124",
                    semester=7,
                    branch="Computer Science and Business Systems",
                    password_hash="",  # Will be set below
                    is_active=True
                ),
                Student(
                    id="STU003",
                    usn="1MS22EC001",
                    name="Mike Johnson",
                    email="mike.johnson@example.com",
                    phone="+1-555-0125",
                    semester=3,
                    branch="Electronics and Communication Engineering",
                    password_hash="",  # Will be set below
                    is_active=True
                )
            ]
            
            # Set passwords for students
            for student in students:
                student.set_password("password123")
                db.session.add(student)
            
            db.session.commit()
            print("Sample data created successfully!")
        else:
            print("Database already contains data. Skipping sample data creation.")
        print("Database initialization completed!")

if __name__ == "__main__":
    init_database()
