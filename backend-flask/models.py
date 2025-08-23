from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import uuid
import bcrypt

db = SQLAlchemy()

class Event(db.Model):
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text, nullable=False)
    date = db.Column(db.Date, nullable=False)
    time = db.Column(db.Time, nullable=False)
    duration = db.Column(db.Integer, default=2)  # hours
    location = db.Column(db.String(200), nullable=False)
    category = db.Column(db.String(100), nullable=False)
    capacity = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Numeric(10, 2), default=0.00)
    image = db.Column(db.String(500))
    organizer = db.Column(db.String(200))
    status = db.Column(db.String(50), default='active')
    tags = db.Column(db.JSON)  # Store as JSON array
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    registrations = db.relationship('Registration', backref='event', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'date': self.date.isoformat() if self.date else None,
            'time': self.time.strftime('%H:%M') if self.time else None,
            'duration': self.duration,
            'location': self.location,
            'category': self.category,
            'capacity': self.capacity,
            'price': float(self.price) if self.price else 0.0,
            'image': self.image,
            'organizer': self.organizer,
            'status': self.status,
            'tags': self.tags or [],
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Student(db.Model):
    __tablename__ = 'students'
    
    id = db.Column(db.String(20), primary_key=True)  # USN
    name = db.Column(db.String(200), nullable=False)
    email = db.Column(db.String(200), unique=True, nullable=False)
    phone = db.Column(db.String(20))
    usn = db.Column(db.String(20), unique=True, nullable=False)
    semester = db.Column(db.Integer, nullable=False)  # 1-8
    branch = db.Column(db.String(100), nullable=False)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    registrations = db.relationship('Registration', backref='student', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        self.password_hash = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
    
    def check_password(self, password):
        return bcrypt.checkpw(password.encode('utf-8'), self.password_hash.encode('utf-8'))
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'email': self.email,
            'phone': self.phone,
            'usn': self.usn,
            'semester': self.semester,
            'branch': self.branch,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }

class Registration(db.Model):
    __tablename__ = 'registrations'
    
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    event_id = db.Column(db.Integer, db.ForeignKey('events.id'), nullable=False)
    student_id = db.Column(db.String(20), db.ForeignKey('students.id'), nullable=False)
    amount_paid = db.Column(db.Numeric(10, 2), nullable=False)
    payment_status = db.Column(db.String(50), default='pending')
    payment_method = db.Column(db.String(50), default='card')
    transaction_id = db.Column(db.String(100))
    special_requirements = db.Column(db.Text)
    registered_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self):
        return {
            'id': self.id,
            'event_id': self.event_id,
            'student_id': self.student_id,
            'amount_paid': float(self.amount_paid) if self.amount_paid else 0.0,
            'payment_status': self.payment_status,
            'payment_method': self.payment_method,
            'transaction_id': self.transaction_id,
            'special_requirements': self.special_requirements,
            'registered_at': self.registered_at.isoformat() if self.registered_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
