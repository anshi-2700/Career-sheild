import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError, DBAPIError, InvalidatePoolError
from .config import settings

def create_db_engine():
    db_url = settings.DATABASE_URL
    if "sqlite" in db_url:
        return create_engine(db_url, connect_args={"check_same_thread": False})
    
    # Try connecting to PostgreSQL / Supabase with sslmode=require and pooler retry
    urls_to_try = [db_url]
    if "supabase.co:5432" in db_url:
        urls_to_try.append(db_url.replace("supabase.co:5432", "supabase.co:6543"))

    last_err = None
    for target_url in urls_to_try:
        try:
            engine = create_engine(
                target_url,
                pool_pre_ping=True,
                pool_recycle=180,
                pool_size=5,
                max_overflow=10,
                pool_timeout=10,
                connect_args={"connect_timeout": 10}
            )
            with engine.connect() as conn:
                conn.execute(text("SELECT 1"))
            print(f"Connected successfully to PostgreSQL database ({target_url[:35]}...).")
            return engine
        except Exception as e:
            last_err = e
            print(f"PostgreSQL connection attempt failed for target ({target_url[:35]}...):", e)
    
    print("NOTICE: Supabase PostgreSQL direct connection failed:", last_err)
    print("AUTOMATED FAILOVER: Switching to writable Vercel /tmp SQLite database (sqlite:////tmp/careershield.db)")
    fallback_url = "sqlite:////tmp/careershield.db"
    return create_engine(fallback_url, connect_args={"check_same_thread": False})

engine = create_db_engine()
fallback_engine = create_engine("sqlite:////tmp/careershield.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
FallbackSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=fallback_engine)

Base = declarative_base()

def get_db():
    """
    Fail-safe database dependency.
    Only catches database driver connection errors (OperationalError, DBAPIError, InvalidatePoolError)
    to perform automatic failover without interfering with FastAPI HTTP exceptions.
    """
    db = None
    try:
        db = SessionLocal()
        # Pre-ping active session socket
        db.execute(text("SELECT 1"))
    except (OperationalError, DBAPIError, InvalidatePoolError) as e:
        print(f"DATABASE RESILIENCY NOTICE [Auto-Failover to Local DB]: {e}")
        try:
            engine.dispose()
        except Exception:
            pass
        if db:
            try:
                db.rollback()
                db.close()
            except Exception:
                pass
        db = FallbackSessionLocal()

    try:
        yield db
    finally:
        if db:
            try:
                db.close()
            except Exception:
                pass
