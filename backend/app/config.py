import os
import re
import urllib.parse
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def sanitize_db_url(url: str) -> str:
    if not url:
        return "sqlite:////tmp/careershield.db"
    
    # Strip whitespace and quotes
    url = url.strip().strip("'").strip('"')
    
    # Remove accidental leftover brackets from template placeholders
    url = re.sub(r':\[([^\]@]+)\]@', r':\1@', url)
    url = re.sub(r':([^\]@]+)\]@', r':\1@', url)
    url = re.sub(r':\[([^\]@]+)@', r':\1@', url)

    # Normalize postgres:// to postgresql://
    if url.startswith("postgres://"):
        url = url.replace("postgres://", "postgresql://", 1)

    # URL-encode password properly (unquote first to avoid double encoding %2540)
    if "postgresql://" in url or "postgres://" in url:
        try:
            pattern = r'^(postgresql:\/\/[^:]+:)([^@]+)(@.+)$'
            match = re.match(pattern, url)
            if match:
                prefix, raw_pass, suffix = match.groups()
                # Unquote any existing % encoding, then quote cleanly ONCE
                clean_pass = urllib.parse.unquote(raw_pass)
                encoded_pass = urllib.parse.quote_plus(clean_pass)
                url = f"{prefix}{encoded_pass}{suffix}"
        except Exception as e:
            print("URL sanitize error:", e)

    # Ensure sslmode=require is present for Supabase / PostgreSQL cloud connections
    if ("supabase" in url or "postgresql" in url) and "sslmode" not in url:
        sep = "&" if "?" in url else "?"
        url += f"{sep}sslmode=require"

    return url

class Settings:
    PROJECT_NAME: str = "CareerShield"
    VERSION: str = "1.0.0"
    SECRET_KEY: str = os.getenv("SECRET_KEY", "careershield_super_secret_jwt_key_2026_bca_final_year")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours

    # Supabase / PostgreSQL or Writable /tmp SQLite Database Connection String
    DATABASE_URL: str = sanitize_db_url(os.getenv("DATABASE_URL", "sqlite:////tmp/careershield.db"))

    # Supabase Credentials (Optional)
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "").strip()
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "").strip()

    # Data Retention Policy (in days)
    RESUME_RETENTION_DAYS: int = 40
    FAKE_JOB_RETENTION_DAYS: int = 90
    ACTIVITY_LOG_RETENTION_DAYS: int = 180

    # Max File Upload Size (10 MB)
    MAX_UPLOAD_SIZE: int = 10 * 1024 * 1024
    ALLOWED_EXTENSIONS: set = {".pdf", ".docx"}

settings = Settings()
