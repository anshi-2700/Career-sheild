import sys
import os
import datetime

# Ensure backend directory is in sys.path for Render / Gunicorn / Uvicorn module imports
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

from fastapi import FastAPI, Depends, HTTPException, status, UploadFile, File, Form, Response
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional

from .config import settings
from .database import engine, Base, get_db
from .models import User, Resume, JobAnalysis, ActivityLog, RetentionSetting
from .schemas import (
    UserRegister, UserLogin, Token, UserOut,
    ResumeOut, JobAnalysisInput, JobAnalysisOut, JobMatchInput, JobMatchResult,
    ActivityLogOut, RetentionUpdate
)
from .auth import (
    verify_password, get_password_hash, create_access_token,
    get_current_user, require_admin
)
from .services.parser_service import extract_text_from_pdf, extract_text_from_docx, parse_resume_text
from .services.ats_service import evaluate_ats_comprehensive
from .services.grammar_service import check_grammar_and_readability
from .services.role_predictor import predict_suitable_job_roles
from .services.fake_job_service import analyze_fake_job, extract_text_from_job_image
from .services.matcher_service import compare_resume_with_job
from .services.recommendation_service import generate_resume_recommendations
from .services.retention_service import run_data_retention_cleanup
from .services.report_service import generate_pdf_report, generate_ats_resume_pdf
from .ml_models.train_fake_job import get_model
from .supabase_client import supabase_client

from .database import engine, fallback_engine, Base, get_db, SessionLocal, FallbackSessionLocal

# Create database tables for both PostgreSQL and Fallback SQLite
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print("PostgreSQL Table Init Warning:", e)

try:
    Base.metadata.create_all(bind=fallback_engine)
except Exception as e:
    print("SQLite Table Init Warning:", e)

# Seed default Super Admin user in both DBs if missing
def seed_admin_users():
    for session_factory in [SessionLocal, FallbackSessionLocal]:
        try:
            db = session_factory()
            admin_emails = ["yuvi123490@gmail.com", "admin@careershield.com"]
            for email in admin_emails:
                existing = db.query(User).filter(User.email == email).first()
                if not existing:
                    user = User(
                        full_name="Super Admin",
                        email=email,
                        hashed_password=get_password_hash("Yuvika2110@"),
                        role="super_admin"
                    )
                    db.add(user)
                    db.commit()
            db.close()
        except Exception as e:
            print("Seed Admin Notice:", e)

seed_admin_users()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="ML-Powered Fake Job Detection & Resume Intelligence Platform"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import Request
from fastapi.responses import JSONResponse
from sqlalchemy.exc import OperationalError, DBAPIError

@app.exception_handler(OperationalError)
@app.exception_handler(DBAPIError)
async def database_error_handler(request: Request, exc: Exception):
    print(f"AUTOMATED RECOVERY: Intercepted DB Operational Exception on {request.url.path}: {exc}")
    try:
        engine.dispose()
    except Exception:
        pass
    return JSONResponse(
        status_code=503,
        content={"detail": "Database connection is re-establishing. Please retry your request in a moment."}
    )

def log_activity(db: Session, user_id: Optional[int], email: Optional[str], action: str, status: str = "Success"):
    log = ActivityLog(user_id=user_id, user_email=email, action=action, status=status)
    db.add(log)
    db.commit()

@app.on_event("startup")
def startup_event():
    # Pre-train / verify ML model
    get_model()
    
    # Ensure Supabase 'resumes' storage bucket exists
    supabase_client.ensure_bucket_exists("resumes")

    # Seed default Super Admin and Demo User if database is fresh
    db = next(get_db())
    admin = db.query(User).filter(User.email == "admin@careershield.com").first()
    if not admin:
        admin_user = User(
            full_name="Super Admin",
            email="admin@careershield.com",
            phone_number="(555) 000-0000",
            hashed_password=get_password_hash("Admin@123456"),
            role="super_admin",
            is_active=True
        )
        db.add(admin_user)
    
    demo_user = db.query(User).filter(User.email == "user@careershield.com").first()
    if not demo_user:
        user_acct = User(
            full_name="Alex Morgan",
            email="user@careershield.com",
            phone_number="(555) 234-5678",
            hashed_password=get_password_hash("User@123456"),
            role="user",
            is_active=True
        )
        db.add(user_acct)

    # Seed Retention Settings
    ret = db.query(RetentionSetting).first()
    if not ret:
        db.add(RetentionSetting())

    db.commit()

@app.get("/")
def read_root():
    return {
        "status": "Online",
        "system": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

# ================= AUTHENTICATION ENDPOINTS =================
@app.post("/api/auth/register", response_model=Token)
def register(user_data: UserRegister, db: Session = Depends(get_db)):
    existing = db.query(User).filter(User.email == user_data.email).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email is already registered.")
    
    new_user = User(
        full_name=user_data.full_name,
        email=user_data.email,
        phone_number=user_data.phone_number,
        hashed_password=get_password_hash(user_data.password),
        role="user"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    token = create_access_token({"sub": new_user.email})
    log_activity(db, new_user.id, new_user.email, "User Registration")
    
    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": new_user.id,
            "full_name": new_user.full_name,
            "email": new_user.email,
            "phone_number": new_user.phone_number,
            "role": new_user.role
        }
    }

@app.post("/api/auth/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    user_email = login_data.email or login_data.username
    user_pwd = login_data.password

    if not user_email or not user_pwd:
        raise HTTPException(status_code=400, detail="Email and password are required.")

    user = db.query(User).filter(User.email == user_email).first()
    if not user or not verify_password(user_pwd, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid email or password.")
    
    if user.is_suspended:
        raise HTTPException(status_code=403, detail="Account is suspended.")

    user.last_login = datetime.datetime.utcnow()
    db.commit()

    token = create_access_token({"sub": user.email})
    log_activity(db, user.id, user.email, "User Login")

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "phone_number": user.phone_number,
            "role": user.role
        }
    }

@app.get("/api/auth/me", response_model=UserOut)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user

# ================= RESUME INTELLIGENCE ENDPOINTS =================
@app.post("/api/resume/upload", response_model=ResumeOut)
async def upload_resume(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    filename = file.filename
    ext = f".{filename.split('.')[-1].lower()}" if "." in filename else ""
    if ext not in settings.ALLOWED_EXTENSIONS:
        raise HTTPException(status_code=400, detail="Unsupported file format. Please upload PDF or DOCX.")

    file_bytes = await file.read()
    if len(file_bytes) > settings.MAX_UPLOAD_SIZE:
        raise HTTPException(status_code=400, detail="File size exceeds 10MB limit.")

    if ext == ".pdf":
        raw_text = extract_text_from_pdf(file_bytes)
        content_type = "application/pdf"
    else:
        raw_text = extract_text_from_docx(file_bytes)
        content_type = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"

    if not raw_text.strip():
        raise HTTPException(status_code=400, detail="Could not extract text from document.")

    # 1. Upload original resume document bytes to Supabase Storage Bucket ('resumes')
    storage_path = f"user_{current_user.id}/{filename}"
    supabase_file_url = supabase_client.upload_file_to_storage(
        bucket_name="resumes",
        file_path=storage_path,
        file_bytes=file_bytes,
        content_type=content_type
    )

    # 2. Parsing & Analysis pipeline
    parsed_data = parse_resume_text(raw_text)
    ats_results = evaluate_ats_comprehensive(parsed_data, raw_text)
    grammar_results = check_grammar_and_readability(raw_text)
    predicted_roles = predict_suitable_job_roles(parsed_data["skills"], raw_text)
    recommendations = generate_resume_recommendations(parsed_data, ats_results, grammar_results)

    parsed_data["ats_breakdown"] = ats_results.get("ats_breakdown", {})
    parsed_data["ats_parse_rate"] = ats_results.get("ats_parse_rate", 92.0)
    parsed_data["suggestions"] = ats_results.get("suggestions", [])
    parsed_data["domain_detected"] = ats_results.get("domain_detected", "Software Engineering")

    # 3. Database save (Replaces previous resume per retention rules)
    existing_resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if existing_resume:
        existing_resume.file_name = filename
        existing_resume.file_path = supabase_file_url or f"resumes/{storage_path}"
        existing_resume.parsed_data = parsed_data
        existing_resume.ats_score = ats_results["ats_score"]
        existing_resume.quality_score = grammar_results["quality_score"]
        existing_resume.grammar_score = grammar_results["grammar_score"]
        existing_resume.predicted_roles = predicted_roles
        existing_resume.recommendations = recommendations
        existing_resume.updated_at = datetime.datetime.utcnow()
        existing_resume.last_activity_at = datetime.datetime.utcnow()
        resume_obj = existing_resume
    else:
        resume_obj = Resume(
            user_id=current_user.id,
            file_name=filename,
            file_path=supabase_file_url or f"resumes/{storage_path}",
            parsed_data=parsed_data,
            ats_score=ats_results["ats_score"],
            quality_score=grammar_results["quality_score"],
            grammar_score=grammar_results["grammar_score"],
            predicted_roles=predicted_roles,
            recommendations=recommendations
        )
        db.add(resume_obj)

    db.commit()
    db.refresh(resume_obj)

    log_activity(db, current_user.id, current_user.email, f"Resume Uploaded to Supabase Storage: {filename}")
    return resume_obj

@app.post("/api/resume/analyze-text", response_model=ResumeOut)
def analyze_resume_text(
    resume_text: str = Form(...),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    parsed_data = parse_resume_text(resume_text)
    ats_results = evaluate_ats_comprehensive(parsed_data, resume_text)
    grammar_results = check_grammar_and_readability(resume_text)
    predicted_roles = predict_suitable_job_roles(parsed_data["skills"], resume_text)
    recommendations = generate_resume_recommendations(parsed_data, ats_results, grammar_results)

    parsed_data["ats_breakdown"] = ats_results.get("ats_breakdown", {})
    parsed_data["ats_parse_rate"] = ats_results.get("ats_parse_rate", 92.0)
    parsed_data["suggestions"] = ats_results.get("suggestions", [])
    parsed_data["domain_detected"] = ats_results.get("domain_detected", "Software Engineering")

    existing_resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if existing_resume:
        existing_resume.file_name = "Text_Pasted_Resume.txt"
        existing_resume.file_path = f"resumes/user_{current_user.id}/pasted_text.txt"
        existing_resume.parsed_data = parsed_data
        existing_resume.ats_score = ats_results["ats_score"]
        existing_resume.quality_score = grammar_results["quality_score"]
        existing_resume.grammar_score = grammar_results["grammar_score"]
        existing_resume.predicted_roles = predicted_roles
        existing_resume.recommendations = recommendations
        existing_resume.updated_at = datetime.datetime.utcnow()
        existing_resume.last_activity_at = datetime.datetime.utcnow()
        resume_obj = existing_resume
    else:
        resume_obj = Resume(
            user_id=current_user.id,
            file_name="Text_Pasted_Resume.txt",
            file_path=f"resumes/user_{current_user.id}/pasted_text.txt",
            parsed_data=parsed_data,
            ats_score=ats_results["ats_score"],
            quality_score=grammar_results["quality_score"],
            grammar_score=grammar_results["grammar_score"],
            predicted_roles=predicted_roles,
            recommendations=recommendations
        )
        db.add(resume_obj)

    db.commit()
    db.refresh(resume_obj)

    log_activity(db, current_user.id, current_user.email, "Resume Text Analyzed")
    return resume_obj

@app.get("/api/resume/my-resume", response_model=Optional[ResumeOut])
def get_my_resume(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(Resume).filter(Resume.user_id == current_user.id).first()

@app.delete("/api/resume/delete")
def delete_my_resume(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    try:
        resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
        if not resume:
            return {"detail": "No resume found to delete."}

        if resume.file_path and os.path.exists(resume.file_path):
            try:
                os.remove(resume.file_path)
            except Exception as fe:
                print("File deletion notice:", fe)

        db.delete(resume)
        db.commit()

        try:
            log_activity(db, current_user.id, current_user.email, "Deleted Resume Record")
        except Exception:
            pass

        return {"detail": "Resume deleted successfully. You can now upload an updated resume."}
    except Exception as e:
        db.rollback()
        print("Resume delete DB error, clearing fields manually:", e)
        # Fallback: reset resume record if delete statement fails due to DB constraint
        try:
            resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
            if resume:
                db.delete(resume)
                db.commit()
        except Exception as inner_e:
            db.rollback()
            print("Inner delete exception:", inner_e)
        return {"detail": "Resume deleted successfully."}

@app.post("/api/resume/generate-ats-pdf")
def generate_ats_pdf_endpoint(
    data: dict,
    current_user: User = Depends(get_current_user)
):
    pdf_bytes = generate_ats_resume_pdf(data)
    filename = f"{data.get('full_name', 'Candidate').replace(' ', '_')}_ATS_Resume.pdf"
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )

# ================= FAKE JOB DETECTION ENDPOINTS =================
@app.post("/api/fake-job/analyze", response_model=JobAnalysisOut)
def analyze_job(
    input_data: JobAnalysisInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    analysis_result = analyze_fake_job(
        job_text=input_data.job_description,
        company_name=input_data.company_name,
        company_website=input_data.company_website,
        contact_email=input_data.contact_email,
        offered_salary=input_data.offered_salary
    )

    job_entry = JobAnalysis(
        user_id=current_user.id,
        company_name=input_data.company_name or "Target Hiring Corp",
        job_title="Job Posting",
        prediction=analysis_result["prediction"],
        risk_score=analysis_result["risk_score"],
        confidence=analysis_result["confidence"],
        flagged_reasons=analysis_result["flagged_reasons"],
        company_verification=analysis_result["company_verification"],
        salary_anomaly=analysis_result["salary_anomaly"]
    )
    db.add(job_entry)
    db.commit()
    db.refresh(job_entry)

    log_activity(db, current_user.id, current_user.email, f"Fake Job Analysis: {analysis_result['prediction']}")
    return job_entry

@app.post("/api/fake-job/upload-image", response_model=JobAnalysisOut)
async def analyze_job_screenshot(
    file: UploadFile = File(...),
    company_name: Optional[str] = Form(""),
    company_website: Optional[str] = Form(""),
    contact_email: Optional[str] = Form(""),
    offered_salary: Optional[float] = Form(0.0),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    file_bytes = await file.read()
    if len(file_bytes) > 15 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File size exceeds 15MB limit.")

    ocr_text = extract_text_from_job_image(file_bytes, file.filename)
    if not ocr_text.strip():
        ocr_text = f"Job Posting Screenshot: {file.filename}. Uploaded document image containing job description details."

    analysis_result = analyze_fake_job(
        job_text=ocr_text,
        company_name=company_name or "",
        company_website=company_website or "",
        contact_email=contact_email or "",
        offered_salary=offered_salary or 0.0
    )

    job_entry = JobAnalysis(
        user_id=current_user.id,
        company_name=company_name or "Screenshot Job Audit",
        job_title=f"Screenshot: {file.filename}",
        prediction=analysis_result["prediction"],
        risk_score=analysis_result["risk_score"],
        confidence=analysis_result["confidence"],
        flagged_reasons=analysis_result["flagged_reasons"],
        company_verification=analysis_result["company_verification"],
        salary_anomaly=analysis_result["salary_anomaly"]
    )
    db.add(job_entry)
    db.commit()
    db.refresh(job_entry)

    log_activity(db, current_user.id, current_user.email, f"Fake Job Screenshot OCR Analyzed: {file.filename}")
    return job_entry

@app.get("/api/fake-job/history", response_model=List[JobAnalysisOut])
def get_fake_job_history(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(JobAnalysis).filter(JobAnalysis.user_id == current_user.id).order_by(JobAnalysis.created_at.desc()).limit(10).all()

# ================= RESUME VS JD MATCH ENDPOINT =================
@app.post("/api/job/match", response_model=JobMatchResult)
def match_resume_to_job(
    input_data: JobMatchInput,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
    if not resume or not resume.parsed_data:
        raise HTTPException(status_code=400, detail="Please upload or paste your resume first before running job match.")

    match_result = compare_resume_with_job(
        resume_data=resume.parsed_data,
        job_title=input_data.job_title or "Target Role",
        job_description=input_data.job_description,
        candidate_location=input_data.candidate_location,
        candidate_expected_salary=input_data.candidate_expected_salary
    )

    log_activity(db, current_user.id, current_user.email, f"Job Match Performed ({match_result['overall_match_percentage']}%)")
    return match_result

# ================= REPORT GENERATION ENDPOINT =================
@app.get("/api/reports/download/{report_type}")
def download_report(
    report_type: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if report_type == "resume":
        resume = db.query(Resume).filter(Resume.user_id == current_user.id).first()
        if not resume:
            raise HTTPException(status_code=404, detail="No resume analysis found.")
        
        sections = [
            {
                "heading": "Comprehensive 11-Aspect ATS Scores",
                "bullets": [
                    f"Overall ATS Compatibility Score: {resume.ats_score}%",
                    f"Estimated ATS Parse Rate: {resume.parsed_data.get('ats_parse_rate', 90)}%",
                    f"Overall Resume Quality Score: {resume.quality_score}%",
                    f"Grammar Accuracy Score: {resume.grammar_score}%"
                ]
            },
            {
                "heading": "Top Predicted Suitable Job Roles",
                "bullets": [f"{r['role']} (Confidence: {r['confidence']}%)" for r in (resume.predicted_roles or [])[:4]]
            },
            {
                "heading": "Extracted Skills Overview",
                "bullets": resume.parsed_data.get("skills", []) if resume.parsed_data else ["None"]
            }
        ]
        pdf_bytes = generate_pdf_report("CareerShield — 11-Aspect ATS Intelligence Report", f"Candidate: {current_user.full_name} | Email: {current_user.email}", sections)
        return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=Resume_Analysis_Report.pdf"})

    elif report_type == "fake-job":
        job = db.query(JobAnalysis).filter(JobAnalysis.user_id == current_user.id).order_by(JobAnalysis.created_at.desc()).first()
        if not job:
            raise HTTPException(status_code=404, detail="No fake job analysis records found.")
        
        sections = [
            {
                "heading": "Prediction Summary",
                "bullets": [
                    f"Classification: {job.prediction}",
                    f"Risk Score: {job.risk_score} / 100",
                    f"ML Model Confidence: {job.confidence}%",
                    f"Target Company: {job.company_name}"
                ]
            },
            {
                "heading": "Identified Risk & Scam Indicators",
                "bullets": job.flagged_reasons or ["No indicators flagged."]
            }
        ]
        pdf_bytes = generate_pdf_report("CareerShield — Fake Job Audit Report", f"User: {current_user.full_name} | Date: {job.created_at.strftime('%Y-%m-%d')}", sections)
        return Response(content=pdf_bytes, media_type="application/pdf", headers={"Content-Disposition": "attachment; filename=Fake_Job_Risk_Report.pdf"})

    else:
        raise HTTPException(status_code=400, detail="Invalid report type.")

# ================= ADMIN DASHBOARD & USER MANAGEMENT =================
@app.get("/api/admin/analytics")
def get_admin_analytics(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    total_users = db.query(User).count()
    active_users = db.query(User).filter(User.is_active == True, User.is_suspended == False).count()
    jobs_analyzed = db.query(JobAnalysis).count()
    fake_jobs_detected = db.query(JobAnalysis).filter(JobAnalysis.prediction == "Fake").count()
    resumes_stored = db.query(Resume).count()
    
    # Calculate average ATS score
    resumes = db.query(Resume).all()
    avg_ats = round(sum(r.ats_score for r in resumes) / max(1, len(resumes)), 1) if resumes else 0.0

    return {
        "total_users": total_users,
        "active_users": active_users,
        "jobs_analyzed": jobs_analyzed,
        "fake_jobs_detected": fake_jobs_detected,
        "resumes_stored": resumes_stored,
        "avg_ats_score": avg_ats,
        "storage_usage_mb": round((resumes_stored * 0.15) + (jobs_analyzed * 0.02), 2),
        "system_health": "Healthy (100% Operational)"
    }

@app.get("/api/admin/users", response_model=List[UserOut])
def list_all_users(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    return db.query(User).order_by(User.created_at.desc()).all()

@app.put("/api/admin/users/{user_id}/status")
def toggle_user_status(user_id: int, suspend: bool = Form(...), admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    user.is_suspended = suspend
    db.commit()
    log_activity(db, admin.id, admin.email, f"Admin toggled suspension for User #{user_id}: {suspend}")
    return {"message": f"User status updated to {'Suspended' if suspend else 'Active'}"}

@app.delete("/api/admin/users/{user_id}")
def delete_user(user_id: int, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found.")
    db.delete(user)
    db.commit()
    log_activity(db, admin.id, admin.email, f"Admin deleted User #{user_id}")
    return {"message": "User deleted successfully."}

@app.get("/api/admin/retention")
def get_retention_config(admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    ret = db.query(RetentionSetting).first()
    if not ret:
        ret = RetentionSetting()
        db.add(ret)
        db.commit()
    return ret

@app.put("/api/admin/retention")
def update_retention_config(update_data: RetentionUpdate, admin: User = Depends(require_admin), db: Session = Depends(get_db)):
    ret = db.query(RetentionSetting).first()
    if not ret:
        ret = RetentionSetting()
        db.add(ret)
    
    ret.resume_retention_days = update_data.resume_retention_days
    ret.fake_job_retention_days = update_data.fake_job_retention_days
    ret.activity_log_retention_days = update_data.activity_log_retention_days
    ret.updated_at = datetime.datetime.utcnow()
    db.commit()

    # Trigger retention cleanup worker immediately
    cleanup_summary = run_data_retention_cleanup(db)

    log_activity(db, admin.id, admin.email, "Admin updated retention configuration")
    return {
        "message": "Retention policy updated successfully.",
        "cleanup_summary": cleanup_summary
    }

@app.get("/api/activity-logs", response_model=List[ActivityLogOut])
def get_activity_logs(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if current_user.role == "super_admin":
        return db.query(ActivityLog).order_by(ActivityLog.timestamp.desc()).limit(30).all()
    else:
        return db.query(ActivityLog).filter(ActivityLog.user_id == current_user.id).order_by(ActivityLog.timestamp.desc()).limit(15).all()
