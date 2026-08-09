import re
import io
from urllib.parse import urlparse
from PIL import Image
import fitz # PyMuPDF

try:
    import pytesseract
except Exception:
    pytesseract = None

try:
    import numpy as np
except Exception:
    np = None

try:
    from ..ml_models.train_fake_job import get_model
except Exception:
    get_model = None

FREE_EMAIL_DOMAINS = {"gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "icloud.com", "protonmail.com", "yandex.com"}

def extract_text_from_job_image(file_bytes: bytes, filename: str = "") -> str:
    """
    Extracts text from job screenshots, offer letter images (PNG, JPG, WEBP) or PDFs using PyMuPDF & Tesseract OCR.
    """
    ext = filename.split(".")[-1].lower() if "." in filename else ""
    text = ""

    # If PDF
    if ext == "pdf":
        try:
            doc = fitz.open(stream=file_bytes, filetype="pdf")
            for page in doc:
                text += page.get_text() + "\n"
        except Exception:
            pass

    # If Image (PNG, JPG, JPEG, WEBP, BMP)
    if not text.strip():
        try:
            image = Image.open(io.BytesIO(file_bytes))
            
            # 1. Try pytesseract if available
            if pytesseract:
                try:
                    text = pytesseract.image_to_string(image)
                except Exception:
                    pass

            # 2. Try fitz (PyMuPDF) OCR / Pixmap text fallback
            if not text.strip():
                try:
                    img_doc = fitz.open(stream=file_bytes, filetype=ext if ext in ["png", "jpg", "jpeg", "webp"] else "png")
                    for page in img_doc:
                        text += page.get_text() + "\n"
                except Exception:
                    pass
        except Exception as e:
            print("OCR Image extraction error:", e)

    return text.strip()

def analyze_fake_job(job_text: str, company_name: str = "", company_website: str = "", contact_email: str = "", offered_salary: float = 0.0) -> dict:
    text_lower = job_text.lower()
    flagged_reasons = []
    risk_points = 0

    # Auto-extract contact email from text if missing
    if not contact_email:
        emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', job_text)
        if emails:
            contact_email = emails[0]

    # Auto-extract company website URL if missing
    if not company_website:
        urls = re.findall(r'https?://[^\s<>"]+|www\.[^\s<>"]+', job_text)
        if urls:
            company_website = urls[0]

    # 1. Rule Engine - Scam Indicators
    fee_keywords = ["registration fee", "security deposit", "processing fee", "badge fee", "pay upfront", "application fee", "refundable deposit"]
    for kw in fee_keywords:
        if kw in text_lower:
            risk_points += 25
            flagged_reasons.append(f"Demands upfront payment ({kw.title()}). Legitimate employers never charge candidates.")
            break

    if "telegram" in text_lower or "t.me/" in text_lower:
        risk_points += 20
        flagged_reasons.append("Conducts interviews via Telegram messenger. High risk scam pattern.")
    
    if "whatsapp" in text_lower and "interview" in text_lower:
        risk_points += 15
        flagged_reasons.append("Conducts hiring/interviews strictly via WhatsApp.")

    crypto_keywords = ["crypto", "usdt", "bitcoin", "binance", "tether", "wallet transfer"]
    for kw in crypto_keywords:
        if kw in text_lower:
            risk_points += 20
            flagged_reasons.append(f"Mentions cryptocurrency payment ({kw.upper()}).")
            break

    urgent_keywords = ["urgent hiring", "immediate appointment", "instant selection", "no interview needed", "guaranteed job", "work 1 hour earn"]
    for kw in urgent_keywords:
        if kw in text_lower:
            risk_points += 15
            flagged_reasons.append(f"Uses high-pressure recruitment tactics ({kw.title()}).")
            break

    # Free Email Domain Check for Corporate Hiring
    email_domain_match = True
    if contact_email and "@" in contact_email:
        domain = contact_email.split("@")[-1].lower()
        if domain in FREE_EMAIL_DOMAINS:
            risk_points += 15
            flagged_reasons.append(f"Uses public email domain (@{domain}) for official corporate recruitment.")
            email_domain_match = False
        elif company_website:
            clean_web = company_website.lower().replace("https://", "").replace("http://", "").replace("www.", "").split("/")[0]
            if clean_web and domain not in clean_web and clean_web not in domain:
                risk_points += 10
                flagged_reasons.append(f"Email domain (@{domain}) does not match company website ({clean_web}).")
                email_domain_match = False

    # 2. Company & Domain Verification
    is_https = company_website.lower().startswith("https://") if company_website else False
    has_website = bool(company_website.strip())

    company_verification = {
        "has_website": has_website,
        "is_https": is_https,
        "email_domain_match": email_domain_match,
        "company_name": company_name or "Not Specified"
    }

    if not has_website:
        risk_points += 5
        flagged_reasons.append("No company website provided for verification.")

    # 3. Salary Anomaly Check
    salary_anomaly = {"flagged": False, "reason": "Salary is within normal range."}
    if offered_salary > 250000 and ("entry level" in text_lower or "no experience" in text_lower or "data entry" in text_lower):
        risk_points += 15
        salary_anomaly = {"flagged": True, "reason": "Unrealistic high salary offered for entry-level / no-experience role."}
        flagged_reasons.append("Unrealistic salary anomaly detected.")
    elif "earn $500 per day" in text_lower or "earn 50,000 monthly part time" in text_lower:
        risk_points += 15
        salary_anomaly = {"flagged": True, "reason": "Promises unrealistic daily/part-time returns."}
        flagged_reasons.append("Guaranteed high return salary claim.")

    # 4. ML Model Prediction
    ml_confidence = 85.0
    try:
        model = get_model()
        ml_pred_class = model.predict([job_text])[0] # 0 = Genuine, 1 = Fake
        ml_probs = model.predict_proba([job_text])[0]
        ml_fake_prob = float(ml_probs[1]) * 100.0

        if ml_pred_class == 1:
            risk_points += int(ml_fake_prob * 0.4)
        ml_confidence = round(float(np.max(ml_probs)) * 100.0, 1)
    except Exception:
        pass

    final_risk_score = min(100.0, max(5.0, float(risk_points)))
    prediction_label = "Fake" if final_risk_score >= 45.0 else "Genuine"

    recommendations = []
    if prediction_label == "Fake":
        recommendations = [
            "DO NOT pay any registration fee, security deposit, or laptop dispatch fee.",
            "Avoid sharing government ID numbers or bank details on messaging apps (Telegram/WhatsApp).",
            "Verify the company on official registration databases and LinkedIn.",
            "Report this job posting to platform administrators."
        ]
    else:
        recommendations = [
            "This job posting exhibits standard professional recruitment indicators.",
            "Always research interviewer profiles on LinkedIn before scheduled calls.",
            "Verify official communication comes from corporate email domains."
        ]

    return {
        "prediction": prediction_label,
        "risk_score": final_risk_score,
        "confidence": ml_confidence,
        "flagged_reasons": flagged_reasons if flagged_reasons else ["No suspicious scam indicators detected."],
        "company_verification": company_verification,
        "salary_anomaly": salary_anomaly,
        "extracted_text_preview": job_text[:200] + "..." if len(job_text) > 200 else job_text,
        "recommendations": recommendations
    }
