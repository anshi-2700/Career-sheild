import datetime
from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone_number = Column(String(50), nullable=True) # Phone number field
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user") # 'user' or 'super_admin'
    is_active = Column(Boolean, default=True)
    is_suspended = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    last_login = Column(DateTime, default=datetime.datetime.utcnow)

    resumes = relationship("Resume", back_populates="user", cascade="all, delete-orphan")
    job_analyses = relationship("JobAnalysis", back_populates="user", cascade="all, delete-orphan")
    activity_logs = relationship("ActivityLog", back_populates="user", cascade="all, delete-orphan")

class Resume(Base):
    __tablename__ = "resumes"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False, unique=True) # Only 1 latest resume per user
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=True)
    parsed_data = Column(JSON, nullable=True) # Extracted skills, contact, education, experience
    ats_score = Column(Float, default=0.0)
    quality_score = Column(Float, default=0.0)
    grammar_score = Column(Float, default=0.0)
    predicted_roles = Column(JSON, nullable=True) # List of roles with confidence %
    recommendations = Column(JSON, nullable=True)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    last_activity_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="resumes")

class JobAnalysis(Base):
    __tablename__ = "job_analyses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    company_name = Column(String(255), default="Unknown Company")
    job_title = Column(String(255), default="Job Posting")
    prediction = Column(String(50), nullable=False) # 'Genuine' or 'Fake'
    risk_score = Column(Float, nullable=False) # 0 to 100
    confidence = Column(Float, nullable=False) # percentage 0 to 100
    flagged_reasons = Column(JSON, nullable=True) # List of scam flags
    company_verification = Column(JSON, nullable=True) # Domain, HTTPS check
    salary_anomaly = Column(JSON, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="job_analyses")

class ActivityLog(Base):
    __tablename__ = "activity_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    user_email = Column(String(150), nullable=True)
    action = Column(String(255), nullable=False)
    status = Column(String(50), default="Success")
    device_info = Column(String(255), default="Web Browser")
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    user = relationship("User", back_populates="activity_logs")

class RetentionSetting(Base):
    __tablename__ = "retention_settings"

    id = Column(Integer, primary_key=True, index=True)
    resume_retention_days = Column(Integer, default=40)
    fake_job_retention_days = Column(Integer, default=90)
    activity_log_retention_days = Column(Integer, default=180)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow)
