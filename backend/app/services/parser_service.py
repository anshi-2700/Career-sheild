import re
import io
import fitz # PyMuPDF
import docx
from typing import Dict, Any, List
from .skill_taxonomy import extract_normalized_skills_from_text, normalize_skill, SKILL_SYNONYMS

# Combined multi-domain skill set for matching
SKILL_DATABASE = set(SKILL_SYNONYMS.keys())

def extract_text_from_pdf(file_bytes: bytes) -> str:
    text = ""
    try:
        doc = fitz.open(stream=file_bytes, filetype="pdf")
        for page in doc:
            text += page.get_text() + "\n"
    except Exception:
        text = file_bytes.decode("latin-1", errors="ignore")
    return text

def extract_text_from_docx(file_bytes: bytes) -> str:
    try:
        doc = docx.Document(io.BytesIO(file_bytes))
        fullText = []
        for para in doc.paragraphs:
            fullText.append(para.text)
        return "\n".join(fullText)
    except Exception:
        return file_bytes.decode("utf-8", errors="ignore")

def parse_resume_text(text: str) -> Dict[str, Any]:
    cleaned_text = re.sub(r'\s+', ' ', text).strip()
    text_lower = text.lower()

    # Email extraction
    emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', text)
    email = emails[0] if emails else "Not Found"

    # Phone extraction
    phones = re.findall(r'(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    phone = "".join(phones[0]) if phones else "Not Found"

    # LinkedIn URL
    linkedin_match = re.search(r'linkedin\.com\/in\/[a-zA-Z0-9_-]+', text_lower)
    linkedin = f"https://www.{linkedin_match.group(0)}" if linkedin_match else "Not Found"

    # Portfolio / GitHub URL
    portfolio_match = re.search(r'(github\.com\/[a-zA-Z0-9_-]+|[a-zA-Z0-9_-]+\.(?:io|dev|com|me))', text_lower)
    portfolio = portfolio_match.group(0) if portfolio_match else "Not Found"

    # Candidate Name heuristic
    lines = [l.strip() for l in text.split('\n') if l.strip()]
    name = lines[0] if lines else "Candidate Name"
    if len(name) > 40 or "@" in name or "resume" in name.lower():
        name = "Candidate Name"

    # Location heuristic (Extract Indian & global cities/states)
    location = "Not Specified"
    city_pattern = r'\b(hyderabad|bangalore|bengaluru|mumbai|delhi|pune|chennai|noida|gurgaon|gurugram|kolkata|ahmedabad|kochi|austin|london|new york|san francisco|remote)\b'
    loc_match = re.search(city_pattern, text_lower)
    if loc_match:
        location = loc_match.group(1).title()

    # Skills extraction with normalization
    extracted_skills = sorted(list(extract_normalized_skills_from_text(text)))

    # Education degree extraction
    edu_matches = re.findall(r'\b(mbbs|md|bca|mca|b\.tech|btech|b\.e|be|b\.sc|bsc|b\.a|b\.com|bcom|bba|mba|m\.tech|mtech|diploma|bachelor|master|doctorate|phd)\b', text_lower)
    education_degrees = sorted(list(set([normalize_skill(deg) for deg in edu_matches])))

    # Experience duration calculation (Sum up explicit years or date spans)
    years_matches = re.findall(r'(\d+(?:\.\d+)?)\s*(?:years?|yrs?)\s*(?:of\s*)?(?:exp|experience)?', text_lower)
    total_exp_years = 0.0
    if years_matches:
        try:
            total_exp_years = max([float(y) for y in years_matches])
        except Exception:
            total_exp_years = 2.0
    else:
        # Fallback heuristic: count number of job roles
        exp_role_matches = re.findall(r'(doctor|physician|nurse|receptionist|assistant|manager|developer|engineer|analyst|executive|coordinator|officer|consultant|designer|specialist)[^\n]*', text, re.IGNORECASE)
        total_exp_years = round(min(10.0, max(0.5, len(exp_role_matches) * 1.5)), 1)

    exp_roles = [m.strip() for m in re.findall(r'(doctor|physician|nurse|receptionist|assistant|manager|developer|engineer|analyst|executive|coordinator|officer|consultant|designer|specialist)[^\n]*', text, re.IGNORECASE)[:5]]

    # Projects
    proj_matches = [p.strip() for p in re.findall(r'(project|built|developed|created|managed|implemented|clinical trial|campaign)[^\n]*', text, re.IGNORECASE)[:4]]

    # Certifications
    cert_matches = [c.strip() for c in re.findall(r'(certified|certification|certificate|licensed|license|cpr|aws|pmp)[^\n]*', text, re.IGNORECASE)[:4]]

    # Languages
    languages = []
    if "english" in text_lower: languages.append("English")
    if "hindi" in text_lower: languages.append("Hindi")
    if "spanish" in text_lower: languages.append("Spanish")
    if "french" in text_lower: languages.append("French")
    if not languages: languages = ["English"]

    # Professional Activity Recency (Extract recent years e.g. 2025, 2026)
    recent_years = re.findall(r'\b(202[0-9])\b', text)
    latest_year = max([int(y) for y in recent_years]) if recent_years else 2026

    # Expected Compensation (if mentioned or default)
    comp_match = re.search(r'(\d+)\s*[-–]\s*(\d+)\s*(?:lpa|k|\$|lakhs?)', text_lower)
    if comp_match:
        expected_comp = f"₹{comp_match.group(1)}–{comp_match.group(2)} LPA"
        comp_min = float(comp_match.group(1))
        comp_max = float(comp_match.group(2))
    else:
        expected_comp = "₹6–8 LPA"
        comp_min = 6.0
        comp_max = 8.0

    # 10-Point Profile Completeness Audit
    completeness_items = {
        "Name": name != "Candidate Name",
        "Email": email != "Not Found",
        "Phone": phone != "Not Found",
        "Location": location != "Not Specified",
        "Education": len(education_degrees) > 0,
        "Skills": len(extracted_skills) >= 3,
        "Experience": total_exp_years > 0 or len(exp_roles) > 0,
        "Projects": len(proj_matches) > 0,
        "LinkedIn": linkedin != "Not Found",
        "Certifications": len(cert_matches) > 0
    }
    completed_count = sum(1 for v in completeness_items.values() if v)
    completeness_pct = round((completed_count / 10.0) * 100.0, 1)

    return {
        "candidate_name": name,
        "email": email,
        "phone": phone,
        "location": location,
        "linkedin": linkedin,
        "portfolio": portfolio,
        "summary": cleaned_text[:250] + "...",
        "skills": extracted_skills,
        "education": education_degrees,
        "experience": exp_roles,
        "total_exp_years": total_exp_years,
        "projects": proj_matches,
        "certifications": cert_matches,
        "languages": languages,
        "latest_activity_year": latest_year,
        "expected_compensation": expected_comp,
        "compensation_min_lpa": comp_min,
        "compensation_max_lpa": comp_max,
        "profile_completeness_pct": completeness_pct,
        "completeness_breakdown": completeness_items,
        "word_count": len(cleaned_text.split()),
        "raw_text": text
    }
