from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, declarative_base
from sqlalchemy.exc import OperationalError, DBAPIError, InvalidatePoolError
from .config import settings

def create_db_engine():
    db_url = settings.DATABASE_URL
    if "sqlite" in db_url:
        return create_engine(db_url, connect_args={"check_same_thread": False})
    
    # Try connecting to PostgreSQL / Supabase with pool recycling & connect timeout
    try:
        engine = create_engine(
            db_url,
            pool_pre_ping=True,
            pool_recycle=180,
            pool_size=10,
            max_overflow=20,
            pool_timeout=5,
            connect_args={"connect_timeout": 5}
        )
        # Test connection immediately
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        print("Connected successfully to Supabase PostgreSQL.")
        return engine
    except Exception as e:
        print("NOTICE: Supabase PostgreSQL DNS/Network lookup failed:", e)
        print("AUTOMATED FAILOVER: Switching to local SQLite database (sqlite:///./careershield.db)")
        fallback_url = "sqlite:///./careershield.db"
        return create_engine(fallback_url, connect_args={"check_same_thread": False})

engine = create_db_engine()
fallback_engine = create_engine("sqlite:///./careershield.db", connect_args={"check_same_thread": False})

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
