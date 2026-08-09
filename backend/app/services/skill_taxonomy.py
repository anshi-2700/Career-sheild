"""
CareerShield — Domain-Agnostic Skill Taxonomy & Synonym Normalization Engine
Covers IT, Marketing, Finance, HR, Healthcare, Teaching, Engineering, Sales, Legal, Operations, Design, etc.
"""

import re
from typing import Dict, Set, List, Tuple

# Domain-Agnostic Skill & Concept Normalization Map
# Mapping from raw/synonym forms to standard Canonical Form
SKILL_SYNONYMS: Dict[str, str] = {
    # Tech & Software Engineering
    "js": "JavaScript",
    "javascript": "JavaScript",
    "ts": "TypeScript",
    "typescript": "TypeScript",
    "py": "Python",
    "python": "Python",
    "ml": "Machine Learning",
    "machine learning": "Machine Learning",
    "ai": "Artificial Intelligence",
    "artificial intelligence": "Artificial Intelligence",
    "dl": "Deep Learning",
    "deep learning": "Deep Learning",
    "nlp": "Natural Language Processing",
    "natural language processing": "Natural Language Processing",
    "postgres": "PostgreSQL",
    "postgresql": "PostgreSQL",
    "pgsql": "PostgreSQL",
    "react": "React.js",
    "react.js": "React.js",
    "reactjs": "React.js",
    "vue": "Vue.js",
    "vue.js": "Vue.js",
    "angular": "Angular",
    "node": "Node.js",
    "node.js": "Node.js",
    "nodejs": "Node.js",
    "next.js": "Next.js",
    "nextjs": "Next.js",
    "aws": "Amazon Web Services",
    "amazon web services": "Amazon Web Services",
    "gcp": "Google Cloud Platform",
    "google cloud": "Google Cloud Platform",
    "azure": "Microsoft Azure",
    "microsoft azure": "Microsoft Azure",
    "k8s": "Kubernetes",
    "kubernetes": "Kubernetes",
    "docker": "Docker",
    "rest": "REST APIs",
    "rest api": "REST APIs",
    "restful api": "REST APIs",

    # Marketing & Content
    "seo": "Search Engine Optimization",
    "search engine optimization": "Search Engine Optimization",
    "sem": "Search Engine Marketing",
    "search engine marketing": "Search Engine Marketing",
    "smo": "Social Media Optimization",
    "smm": "Social Media Marketing",
    "ga": "Google Analytics",
    "ga4": "Google Analytics",
    "google analytics": "Google Analytics",
    "content marketing": "Content Marketing",
    "copywriting": "Copywriting",
    "email marketing": "Email Marketing",
    "hubspot": "HubSpot CRM",
    "hubspot crm": "HubSpot CRM",
    "salesforce": "Salesforce CRM",

    # Finance & Accounting
    "gst": "Goods and Services Tax (GST)",
    "goods and services tax": "Goods and Services Tax (GST)",
    "tally": "Tally ERP",
    "tally erp": "Tally ERP",
    "financial analysis": "Financial Analysis",
    "accounting": "Accounting",
    "quickbooks": "QuickBooks",
    "payroll": "Payroll Management",
    "payroll management": "Payroll Management",
    "auditing": "Auditing",
    "taxation": "Taxation & Compliance",
    "corporate finance": "Corporate Finance",

    # HR & People Operations
    "hr": "Human Resources",
    "human resources": "Human Resources",
    "people ops": "Human Resources",
    "people operations": "Human Resources",
    "recruitment": "Talent Acquisition & Recruitment",
    "talent acquisition": "Talent Acquisition & Recruitment",
    "hrms": "HRMS Platforms",
    "employee relations": "Employee Relations",
    "onboarding": "Employee Onboarding",

    # Healthcare & Medical
    "ehr": "Electronic Health Records (EHR)",
    "emr": "Electronic Health Records (EHR)",
    "electronic health records": "Electronic Health Records (EHR)",
    "triage": "Patient Triage",
    "patient triage": "Patient Triage",
    "cpr": "Cardiopulmonary Resuscitation (CPR)",
    "vital signs": "Vital Signs Monitoring",
    "phlebotomy": "Phlebotomy",
    "clinical documentation": "Clinical Documentation",
    "hipaa": "HIPAA Compliance",
    "hipaa compliance": "HIPAA Compliance",
    "medical coding": "Medical Coding & Billing",
    "icd-10": "Medical Coding & Billing",

    # Teaching & Academics
    "curriculum design": "Curriculum Development",
    "curriculum development": "Curriculum Development",
    "lesson planning": "Lesson Planning",
    "classroom management": "Classroom Management",
    "tutoring": "Student Mentorship & Tutoring",

    # Engineering & Operations
    "cad": "Computer-Aided Design (CAD)",
    "autocad": "Computer-Aided Design (CAD)",
    "solidworks": "SolidWorks",
    "matlab": "MATLAB",
    "six sigma": "Six Sigma & Quality Management",
    "lean manufacturing": "Lean Manufacturing",

    # Education Degree Normalization
    "b.tech": "Bachelor of Technology",
    "btech": "Bachelor of Technology",
    "b.e": "Bachelor of Technology",
    "be": "Bachelor of Technology",
    "b.com": "Bachelor of Commerce",
    "bcom": "Bachelor of Commerce",
    "b.sc": "Bachelor of Science",
    "bsc": "Bachelor of Science",
    "bba": "Bachelor of Business Administration",
    "b.b.a": "Bachelor of Business Administration",
    "mba": "Master of Business Administration",
    "m.b.a": "Master of Business Administration",
    "m.tech": "Master of Technology",
    "mtech": "Master of Technology",
    "mca": "Master of Computer Applications",
    "bca": "Bachelor of Computer Applications",
    "mbbs": "Bachelor of Medicine (MBBS)",
    "phd": "Doctor of Philosophy (PhD)"
}

# Domain Classification taxonomy for role relevance
DOMAIN_TAXONOMY: Dict[str, Set[str]] = {
    "Technology & Engineering": {
        "developer", "software", "engineer", "backend", "frontend", "fullstack", "devops",
        "data analyst", "data scientist", "system administrator", "qa", "cloud", "architect"
    },
    "Marketing & Growth": {
        "marketing", "seo", "content", "copywriter", "growth", "brand", "digital marketing",
        "campaign", "social media", "media manager", "public relations"
    },
    "Finance & Accounting": {
        "finance", "financial analyst", "accountant", "auditor", "tax", "treasury",
        "payroll", "controller", "bookkeeper", "investment"
    },
    "Human Resources": {
        "hr", "recruiter", "talent acquisition", "people ops", "hr business partner",
        "human resources", "payroll specialist"
    },
    "Healthcare & Medicine": {
        "doctor", "physician", "nurse", "clinical", "medical", "surgeon", "pharmacist",
        "therapist", "triage", "healthcare"
    },
    "Teaching & Education": {
        "teacher", "professor", "educator", "instructor", "lecturer", "tutor", "academic"
    },
    "Sales & Customer Success": {
        "sales", "account executive", "business development", "customer success", "sales manager"
    }
}

def normalize_skill(skill_raw: str) -> str:
    """Normalizes a raw skill string or acronym into its canonical form."""
    if not skill_raw:
        return ""
    clean = skill_raw.strip().lower()
    return SKILL_SYNONYMS.get(clean, skill_raw.strip().title())

def extract_normalized_skills_from_text(text: str) -> Set[str]:
    """Extracts all recognized skills from arbitrary text and normalizes them."""
    if not text:
        return set()
    text_lower = text.lower()
    found_skills = set()

    for raw, canonical in SKILL_SYNONYMS.items():
        pattern = r'\b' + re.escape(raw) + r'\b'
        if re.search(pattern, text_lower):
            found_skills.add(canonical)

    return found_skills

def classify_role_domain(role_title: str) -> str:
    """Classifies a job or candidate role into a professional domain category."""
    if not role_title:
        return "General"
    title_lower = role_title.lower()
    for domain, keywords in DOMAIN_TAXONOMY.items():
        if any(kw in title_lower for kw in keywords):
            return domain
    return "General"
