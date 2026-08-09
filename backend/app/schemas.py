from datetime import datetime
from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict, Any

# Authentication & User Schemas
class UserRegister(BaseModel):
    full_name: str
    email: EmailStr
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: Dict[str, Any]

class UserOut(BaseModel):
    id: int
    full_name: str
    email: str
    role: str
    is_suspended: bool
    created_at: datetime
    last_login: Optional[datetime] = None

    class Config:
        from_attributes = True

# Resume Analysis Schemas
class ResumeOut(BaseModel):
    id: int
    user_id: int
    file_name: str
    parsed_data: Optional[Dict[str, Any]]
    ats_score: float
    quality_score: float
    grammar_score: float
    predicted_roles: Optional[List[Dict[str, Any]]]
    recommendations: Optional[List[Dict[str, Any]]]
    updated_at: datetime

    class Config:
        from_attributes = True

# Fake Job Input & Output Schemas
class JobAnalysisInput(BaseModel):
    job_description: str
    company_name: Optional[str] = "Unknown"
    company_website: Optional[str] = ""
    contact_email: Optional[str] = ""
    offered_salary: Optional[float] = 0.0

class JobAnalysisOut(BaseModel):
    id: int
    company_name: str
    job_title: str
    prediction: str
    risk_score: float
    confidence: float
    flagged_reasons: Optional[List[str]]
    company_verification: Optional[Dict[str, Any]]
    salary_anomaly: Optional[Dict[str, Any]]
    created_at: datetime

    class Config:
        from_attributes = True

# Job Matching Input & Output Schemas
class JobMatchInput(BaseModel):
    job_title: Optional[str] = "Target Job"
    job_description: str
    candidate_location: Optional[str] = None
    candidate_expected_salary: Optional[str] = None

class JobMatchResult(BaseModel):
    overall_match_percentage: float
    qualitative_rating: Optional[str] = "STRONG MATCH"
    eligibility: Optional[Dict[str, Any]] = None
    breakdown: Optional[Dict[str, Any]] = None
    skill_match: Dict[str, Any]
    keyword_match: Dict[str, Any]
    experience_match: Dict[str, Any]
    education_match: Dict[str, Any]
    location_match: Optional[Dict[str, Any]] = None
    compensation_match: Optional[Dict[str, Any]] = None
    strengths: Optional[List[str]] = None
    gaps: Optional[List[str]] = None
    recommendations: List[str]

# Activity Log Schema
class ActivityLogOut(BaseModel):
    id: int
    user_id: Optional[int]
    user_email: Optional[str]
    action: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# Retention Config Schema
class RetentionUpdate(BaseModel):
    resume_retention_days: int
    fake_job_retention_days: int
    activity_log_retention_days: int
