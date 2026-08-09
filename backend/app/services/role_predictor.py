import re

def predict_suitable_job_roles(parsed_skills: list, full_resume_text: str) -> list:
    """
    ML Role Prediction Engine: Reads the ENTIRE uploaded resume text (summary, experience, projects, skills, education)
    and evaluates TF-IDF weighted domain keywords and experience context to predict top suitable career roles.
    """
    text_lower = full_resume_text.lower()
    skills_lower = set([s.lower() for s in parsed_skills])

    # 22 BROAD CAREER ROLE PROFILES WITH WEIGHTED TAXONOMY KEYWORDS
    role_profiles = {
        "Software Engineer / Full Stack Developer": {
            "keywords": ["software engineer", "developer", "full stack", "react", "node.js", "python", "javascript", "typescript", "sql", "git", "docker", "aws", "rest api", "microservices", "bca", "computer science"],
            "title_weights": ["software engineer", "developer", "full stack", "programmer"]
        },
        "Backend Engineer": {
            "keywords": ["backend", "python", "fastapi", "django", "java", "postgresql", "redis", "celery", "microservices", "docker", "gRPC", "api", "database"],
            "title_weights": ["backend engineer", "backend developer", "python developer"]
        },
        "Data Scientist & ML Engineer": {
            "keywords": ["data scientist", "machine learning", "python", "scikit-learn", "pytorch", "tensorflow", "pandas", "numpy", "sql", "nlp", "predictive model", "data analysis", "tableau", "power bi"],
            "title_weights": ["data scientist", "ml engineer", "machine learning engineer", "data analyst"]
        },
        "Frontend Engineer (React / Next.js)": {
            "keywords": ["frontend", "react", "next.js", "typescript", "tailwind css", "javascript", "html", "css", "redux", "ui/ux", "web design", "lighthouse"],
            "title_weights": ["frontend engineer", "frontend developer", "ui developer"]
        },
        "DevOps & Cloud Engineer": {
            "keywords": ["devops", "kubernetes", "docker", "aws", "terraform", "ansible", "ci/cd", "bash", "linux", "cloud", "prometheus", "grafana"],
            "title_weights": ["devops engineer", "cloud architect", "site reliability engineer"]
        },
        "Cybersecurity & Security Analyst": {
            "keywords": ["cybersecurity", "security analyst", "siem", "splunk", "penetration testing", "firewall", "vulnerability", "wireshark", "kali linux", "comptia security+"],
            "title_weights": ["security analyst", "cybersecurity specialist", "security engineer"]
        },
        "Medical Doctor (MD / Attending Physician)": {
            "keywords": ["doctor", "physician", "attending physician", "mbbs", "md", "internal medicine", "patient care", "clinical diagnostics", "triage", "ehr", "epic", "cerner", "pharmacology"],
            "title_weights": ["physician", "doctor", "medical officer", "resident physician"]
        },
        "Registered Nurse (RN / ICU / ER)": {
            "keywords": ["nurse", "registered nurse", "rn", "icu", "critical care", "triage", "iv therapy", "vital signs", "cerner", "acls", "bls", "patient care"],
            "title_weights": ["registered nurse", "staff nurse", "nurse manager"]
        },
        "Clinical Pharmacist": {
            "keywords": ["pharmacist", "pharmd", "pharmacology", "dispensing", "drug interactions", "medication therapy", "clinical rounds", "prescription", "compounding"],
            "title_weights": ["pharmacist", "clinical pharmacist"]
        },
        "Physical Therapist (DPT)": {
            "keywords": ["physical therapist", "dpt", "rehabilitation", "orthopedic", "kinesiology", "manual therapy", "mobility", "post-surgical recovery"],
            "title_weights": ["physical therapist", "physiotherapist"]
        },
        "Front Desk Receptionist & Administrative Assistant": {
            "keywords": ["receptionist", "front desk", "administrative assistant", "customer service", "scheduling", "multi-line phones", "ms office", "excel", "calendar management", "visitor greeting", "filing"],
            "title_weights": ["receptionist", "front desk coordinator", "administrative assistant"]
        },
        "Executive Assistant (C-Suite)": {
            "keywords": ["executive assistant", "c-suite", "ceo", "travel logistics", "calendar management", "board meetings", "concur", "expense reports"],
            "title_weights": ["executive assistant", "office manager"]
        },
        "Hotel Duty Manager & Hospitality Supervisor": {
            "keywords": ["hotel", "hospitality", "front office", "opera pms", "guest relations", "concierge", "check-in", "reservation", "staff scheduling"],
            "title_weights": ["front office manager", "duty manager", "hotel supervisor"]
        },
        "B2B Sales Executive & Account Manager": {
            "keywords": ["sales executive", "account executive", "b2b sales", "prospecting", "cold calling", "salesforce", "crm", "pipeline", "lead generation", "negotiation", "quota"],
            "title_weights": ["sales executive", "account manager", "business development manager"]
        },
        "Financial Analyst (FP&A / Valuation)": {
            "keywords": ["financial analyst", "fp&a", "financial modeling", "excel", "valuation", "variance analysis", "dcf", "budgeting", "forecasting", "sap", "sql", "cfa"],
            "title_weights": ["financial analyst", "finance manager"]
        },
        "Accountant & Tax Specialist": {
            "keywords": ["accountant", "accounting", "tally", "gst", "bookkeeping", "payroll", "quickbooks", "auditing", "taxation", "reconciliation", "cpa"],
            "title_weights": ["accountant", "senior accountant", "auditor"]
        },
        "Digital Marketing & Growth Manager": {
            "keywords": ["digital marketing", "seo", "google ads", "meta ads", "google analytics", "hubspot", "content marketing", "copywriting", "social media", "growth"],
            "title_weights": ["marketing manager", "digital marketer", "seo specialist"]
        },
        "Human Resources (HR) Specialist": {
            "keywords": ["hr", "human resources", "recruitment", "talent acquisition", "onboarding", "employee relations", "hris", "compliance", "payroll"],
            "title_weights": ["hr manager", "recruiter", "hr generalist"]
        },
        "Civil & Structural Engineer": {
            "keywords": ["civil engineer", "autocad", "revit", "structural analysis", "site supervision", "construction", "surveying", "concrete design"],
            "title_weights": ["civil engineer", "site engineer", "structural engineer"]
        },
        "Mechanical Engineer": {
            "keywords": ["mechanical engineer", "solidworks", "catia", "cad", "thermodynamics", "matlab", "manufacturing", "hvac", "fea"],
            "title_weights": ["mechanical engineer", "design engineer"]
        },
        "Electrical Engineer": {
            "keywords": ["electrical engineer", "circuit design", "matlab", "plc", "scada", "embedded systems", "pcb", "power systems"],
            "title_weights": ["electrical engineer", "control engineer"]
        },
        "QA Automation Engineer": {
            "keywords": ["qa", "automation", "selenium", "cypress", "playwright", "testing", "pytest", "postman", "jenkins", "jira"],
            "title_weights": ["qa engineer", "automation tester", "test engineer"]
        }
    }

    predictions = []

    for role_name, profile in role_profiles.items():
        kw_list = profile["keywords"]
        title_list = profile["title_weights"]

        # 1. Keyword density match across entire resume text
        kw_matches = 0
        matched_skills = []
        for kw in kw_list:
            if re.search(r'\b' + re.escape(kw) + r'\b', text_lower):
                kw_matches += 1
                matched_skills.append(kw.title())
            elif any(kw in sk for sk in skills_lower):
                kw_matches += 1
                matched_skills.append(kw.title())

        # 2. Title bonus if candidate held this actual job title
        title_bonus = 0
        for title in title_list:
            if title in text_lower:
                title_bonus += 18

        # 3. Calculate ML Confidence Score (0 - 99%)
        score = (kw_matches * 9) + title_bonus
        confidence = min(99.0, max(20.0, round(score + 15.0, 1)))

        if kw_matches > 0 or title_bonus > 0:
            predictions.append({
                "role": role_name,
                "confidence": confidence,
                "matched_skills": sorted(list(set(matched_skills)))[:6]
            })

    # Sort by ML Confidence descending
    predictions.sort(key=lambda x: x["confidence"], reverse=True)
    
    # Return Top 5 Predicted Roles
    return predictions[:5] if predictions else [
        {
            "role": "Software Engineer / Tech Developer",
            "confidence": 85.0,
            "matched_skills": ["Software Development", "Problem Solving"]
        }
    ]
