import datetime
from sqlalchemy.orm import Session
from ..models import Resume, JobAnalysis, ActivityLog, RetentionSetting

def run_data_retention_cleanup(db: Session) -> dict:
    retention_setting = db.query(RetentionSetting).first()
    resume_days = retention_setting.resume_retention_days if retention_setting else 40
    fake_job_days = retention_setting.fake_job_retention_days if retention_setting else 90
    activity_days = retention_setting.activity_log_retention_days if retention_setting else 180

    now = datetime.datetime.utcnow()

    # 1. Cleanup inactive resumes (40 days inactive)
    resume_cutoff = now - datetime.timedelta(days=resume_days)
    expired_resumes = db.query(Resume).filter(Resume.last_activity_at < resume_cutoff).all()
    deleted_resumes_count = len(expired_resumes)
    for r in expired_resumes:
        db.delete(r)

    # 2. Cleanup fake job analyses (90 days old)
    job_cutoff = now - datetime.timedelta(days=fake_job_days)
    expired_jobs = db.query(JobAnalysis).filter(JobAnalysis.created_at < job_cutoff).all()
    deleted_jobs_count = len(expired_jobs)
    for j in expired_jobs:
        db.delete(j)

    # 3. Cleanup activity logs (180 days old)
    activity_cutoff = now - datetime.timedelta(days=activity_days)
    expired_logs = db.query(ActivityLog).filter(ActivityLog.timestamp < activity_cutoff).all()
    deleted_logs_count = len(expired_logs)
    for a in expired_logs:
        db.delete(a)

    db.commit()

    return {
        "status": "Success",
        "timestamp": now.isoformat(),
        "resumes_deleted": deleted_resumes_count,
        "job_analyses_deleted": deleted_jobs_count,
        "activity_logs_deleted": deleted_logs_count,
        "applied_retention": {
            "resume_days": resume_days,
            "fake_job_days": fake_job_days,
            "activity_days": activity_days
        }
    }
