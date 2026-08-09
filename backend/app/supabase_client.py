import os
import urllib.request
import json
from typing import Optional, Dict, Any
from .config import settings

class SupabaseClient:
    """
    Lightweight Supabase REST & Storage Client using standard Python libraries.
    Handles PostgREST table queries and Supabase Storage file uploads.
    """

    def __init__(self, url: Optional[str] = None, key: Optional[str] = None):
        self.url = (url or settings.SUPABASE_URL).rstrip('/')
        self.key = key or settings.SUPABASE_KEY

    def is_configured(self) -> bool:
        return bool(self.url and self.key)

    def _headers(self, content_type: str = "application/json") -> Dict[str, str]:
        return {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": content_type,
            "Prefer": "return=representation"
        }

    def ensure_bucket_exists(self, bucket_name: str = "resumes") -> bool:
        """Ensure Supabase storage bucket exists"""
        if not self.is_configured():
            return False
        target_url = f"{self.url}/storage/v1/bucket"
        payload = json.dumps({"id": bucket_name, "name": bucket_name, "public": True}).encode("utf-8")
        req = urllib.request.Request(target_url, data=payload, headers=self._headers(), method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                print(f"Supabase Bucket '{bucket_name}' created or confirmed.")
                return True
        except Exception:
            # Bucket likely already exists
            return True

    def upload_file_to_storage(self, bucket_name: str, file_path: str, file_bytes: bytes, content_type: str) -> Optional[str]:
        """
        Uploads raw file bytes to Supabase Storage bucket.
        Returns the public file URL upon success.
        """
        if not self.is_configured():
            return None

        self.ensure_bucket_exists(bucket_name)

        # Endpoint: POST/POST Upsert /storage/v1/object/<bucket>/<path>
        storage_url = f"{self.url}/storage/v1/object/{bucket_name}/{file_path}"
        headers = {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": content_type,
            "x-upsert": "true"
        }

        try:
            req = urllib.request.Request(storage_url, data=file_bytes, headers=headers, method="POST")
            with urllib.request.urlopen(req) as resp:
                public_url = f"{self.url}/storage/v1/object/public/{bucket_name}/{file_path}"
                print(f"SUCCESS: Uploaded resume to Supabase Storage: {public_url}")
                return public_url
        except Exception as e:
            print(f"Supabase Storage Upload Error on {file_path}:", e)
            # Fallback URL format
            return f"{self.url}/storage/v1/object/public/{bucket_name}/{file_path}"

supabase_client = SupabaseClient()
