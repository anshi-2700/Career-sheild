"""
CareerShield — Multi-Factor Resume ↔ JD Matching Engine
Combines Rule-Based Matching + Skill Taxonomy Normalization + TF-IDF Cosine Similarity + 10 Weighted Dimensions.
"""

import re
from typing import Dict, Any, List, Set, Tuple
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from .skill_taxonomy import (
    SKILL_SYNONYMS, normalize_skill, extract_normalized_skills_from_text, classify_role_domain
)

def compare_resume_with_job(
    resume_data: Dict[str, Any],
    job_title: str,
    job_description: str,
    candidate_location: str = None,
    candidate_expected_salary: str = None,
    custom_weights: Dict[str, float] = None
) -> Dict[str, Any]:
    
    resume_text = resume_data.get("raw_text", "")
    jd_lower = job_description.lower()
    job_title_clean = job_title.strip() if job_title else "Target Role"

    # Default weights (10-dimension starting model summing to 100%)
    weights = {
        "skills": 0.25,
        "experience": 0.15,
        "education": 0.10,
        "keyword_recall": 0.10,
        "role_overlap": 0.10,
        "location": 0.05,
        "compensation": 0.05,
        "projects": 0.05,
        "profile_completeness": 0.05,
        "activity": 0.05
    }
    if custom_weights:
        weights.update(custom_weights)

    # -------------------------------------------------------------
    # 1. SKILL TAXONOMY NORMALIZATION & MATCHING (25%)
    # -------------------------------------------------------------
    candidate_skills = set(resume_data.get("skills", []))

    # Extract JD skills using taxonomy
    jd_skills = extract_normalized_skills_from_text(job_description)
    
    # Fallback: if no skills detected via taxonomy, parse explicit words
    if not jd_skills:
        for skill_key, canonical in SKILL_SYNONYMS.items():
            if re.search(r'\b' + re.escape(skill_key) + r'\b', jd_lower):
                jd_skills.add(canonical)

    matched_skills = sorted(list(candidate_skills.intersection(jd_skills)))
    missing_skills = sorted(list(jd_skills.difference(candidate_skills)))
    additional_skills = sorted(list(candidate_skills.difference(jd_skills)))

    if jd_skills:
        skills_match_pct = round((len(matched_skills) / len(jd_skills)) * 100.0, 1)
    else:
        skills_match_pct = 85.0

    # -------------------------------------------------------------
    # 2. EXPERIENCE DURATION & RELEVANCE MATCH (15%)
    # -------------------------------------------------------------
    # Check if "freshers welcome" or 0 yrs required
    freshers_welcome = bool(re.search(r'\b(fresher|freshers|entry level|no experience|0 years?)\b', jd_lower))
    exp_req_match = re.search(r'(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)', jd_lower)
    
    if exp_req_match:
        required_exp_years = float(exp_req_match.group(1))
    elif freshers_welcome:
        required_exp_years = 0.0
    else:
        required_exp_years = 2.0

    candidate_exp_years = float(resume_data.get("total_exp_years", 0.0))

    if required_exp_years == 0.0 or freshers_welcome:
        exp_duration_pct = 100.0
    else:
        exp_duration_pct = min(100.0, round((candidate_exp_years / required_exp_years) * 100.0, 1))

    # Role Relevance Analysis (Compare candidate role domain vs target role domain)
    candidate_domain = classify_role_domain(" ".join(resume_data.get("experience", [])) + " " + resume_text)
    target_domain = classify_role_domain(job_title_clean + " " + job_description)

    if candidate_domain == target_domain and candidate_domain != "General":
        exp_relevance_pct = 95.0
    elif candidate_domain == "General" or target_domain == "General":
        exp_relevance_pct = 75.0
    else:
        exp_relevance_pct = 35.0  # e.g., Developer applying for Financial Analyst

    overall_exp_pct = round((exp_duration_pct * 0.5) + (exp_relevance_pct * 0.5), 1)

    # -------------------------------------------------------------
    # 3. EDUCATION EQUIVALENCY MATCH (10%)
    # -------------------------------------------------------------
    candidate_degrees = set([normalize_skill(d) for d in resume_data.get("education", [])])
    
    # Detect JD required degree level
    jd_edu_matches = re.findall(r'\b(mbbs|md|bca|mca|b\.tech|btech|b\.e|be|b\.sc|bsc|b\.a|b\.com|bcom|bba|mba|m\.tech|mtech|diploma|bachelor|master|doctorate|phd)\b', jd_lower)
    jd_degrees = set([normalize_skill(d) for d in jd_edu_matches])

    if not jd_degrees:
        education_pct = 100.0
        edu_status = "No strict degree requirement specified."
    elif candidate_degrees.intersection(jd_degrees):
        education_pct = 100.0
        edu_status = f"Meets degree requirement ({', '.join(candidate_degrees.intersection(jd_degrees))})."
    elif candidate_degrees:
        education_pct = 70.0
        edu_status = f"Candidate has {', '.join(candidate_degrees)}; JD prefers {', '.join(jd_degrees)}."
    else:
        education_pct = 50.0
        edu_status = "Education details incomplete on resume."

    # -------------------------------------------------------------
    # 4. CATEGORIZED KEYWORD RECALL (10%)
    # -------------------------------------------------------------
    # TF-IDF Cosine Similarity for general textual recall
    try:
        vectorizer = TfidfVectorizer(stop_words='english')
        tfidf_matrix = vectorizer.fit_transform([resume_text, job_description])
        cosine_sim = float(cosine_similarity(tfidf_matrix[0:1], tfidf_matrix[1:2])[0][0])
        keyword_recall_pct = round(cosine_sim * 100.0, 1)
    except Exception:
        keyword_recall_pct = 60.0

    # Categorized Keyword Extraction (Required vs Preferred vs Contextual)
    all_jd_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', jd_lower)) - {
        "with", "this", "that", "from", "have", "will", "your", "team", "work", "role", "years", "experience"
    }
    resume_words = set(re.findall(r'\b[a-zA-Z]{4,}\b', resume_text.lower()))
    
    missing_keywords = sorted(list(all_jd_words.difference(resume_words)))[:12]

    # -------------------------------------------------------------
    # 5. ROLE OVERLAP (10%)
    # -------------------------------------------------------------
    role_overlap_pct = exp_relevance_pct

    # -------------------------------------------------------------
    # 6. LOCATION COMPATIBILITY (5%)
    # -------------------------------------------------------------
    is_remote_jd = bool(re.search(r'\b(remote|work from home|wfh|anywhere)\b', jd_lower))
    cand_loc = (candidate_location or resume_data.get("location", "Not Specified")).title()

    if is_remote_jd:
        location_pct = 100.0
        location_status = "100% Compatible (Remote Position)"
    elif cand_loc != "Not Specified" and (cand_loc.lower() in jd_lower or "any" in jd_lower):
        location_pct = 100.0
        location_status = f"100% Compatible ({cand_loc})"
    elif cand_loc != "Not Specified":
        location_pct = 40.0
        location_status = f"Location Difference Warning (Candidate: {cand_loc})"
    else:
        location_pct = 75.0
        location_status = "Location Not Specified on Resume"

    # -------------------------------------------------------------
    # 7. COMPENSATION COMPATIBILITY (5%)
    # -------------------------------------------------------------
    cand_comp = candidate_expected_salary or resume_data.get("expected_compensation", "₹6–8 LPA")
    
    # Parse numbers from JD compensation if present
    jd_comp_match = re.search(r'(\d+)\s*[-–]\s*(\d+)\s*(?:lpa|k|\$|lakhs?)', jd_lower)
    if jd_comp_match:
        jd_comp_min = float(jd_comp_match.group(1))
        jd_comp_max = float(jd_comp_match.group(2))
        cand_min = float(resume_data.get("compensation_min_lpa", 6.0))

        if cand_min <= jd_comp_max:
            comp_pct = 100.0
            comp_status = f"Compatible (Expectation {cand_comp} within JD Range ₹{jd_comp_min}–{jd_comp_max} LPA)"
        else:
            comp_pct = 50.0
            comp_status = f"Compensation Warning (Candidate expectation {cand_comp} exceeds JD Budget ₹{jd_comp_min}–{jd_comp_max} LPA)"
    else:
        comp_pct = 90.0
        comp_status = f"Expected Compensation ({cand_comp}) - Budget Not Disclosed in JD"

    # -------------------------------------------------------------
    # 8. PROJECTS & ACHIEVEMENTS (5%)
    # -------------------------------------------------------------
    proj_count = len(resume_data.get("projects", []))
    if proj_count >= 3:
        projects_pct = 100.0
    elif proj_count >= 1:
        projects_pct = 75.0
    else:
        projects_pct = 45.0

    # -------------------------------------------------------------
    # 9. PROFILE COMPLETENESS (5%)
    # -------------------------------------------------------------
    profile_completeness_pct = float(resume_data.get("profile_completeness_pct", 85.0))

    # -------------------------------------------------------------
    # 10. PROFESSIONAL ACTIVITY & RECENCY (5%)
    # -------------------------------------------------------------
    latest_year = int(resume_data.get("latest_activity_year", 2026))
    if latest_year >= 2025:
        activity_pct = 100.0
        activity_status = f"Active Profile (Latest Activity: {latest_year})"
    elif latest_year >= 2023:
        activity_pct = 75.0
        activity_status = f"Moderate Activity (Latest Activity: {latest_year})"
    else:
        activity_pct = 50.0
        activity_status = f"Career Gap Notice (Latest Activity: {latest_year})"

    # -------------------------------------------------------------
    # LEVEL 1 — ELIGIBILITY HARD-REQUIREMENT CHECK
    # -------------------------------------------------------------
    eligibility_passed = True
    eligibility_warnings = []

    # Hard license / certification checks (e.g. Nursing license, CPA, MBBS)
    hard_license_patterns = [
        (r'\b(nursing license|rn license|valid nursing)\b', "Valid Nursing License"),
        (r'\b(cpa|chartered accountant|ca certified)\b', "CPA / Chartered Accountant Certification"),
        (r'\b(bar admission|licensed attorney)\b', "Bar Association License"),
    ]
    for pattern, label in hard_license_patterns:
        if re.search(pattern, jd_lower):
            if not re.search(pattern, resume_text.lower()):
                eligibility_passed = False
                eligibility_warnings.append(f"Hard Requirement Missing: JD requires {label}.")

    # -------------------------------------------------------------
    # LEVEL 2 — FINAL OVERALL WEIGHTED MATCH CALCULATION
    # -------------------------------------------------------------
    overall_score = round(
        (skills_match_pct * weights["skills"]) +
        (overall_exp_pct * weights["experience"]) +
        (education_pct * weights["education"]) +
        (keyword_recall_pct * weights["keyword_recall"]) +
        (role_overlap_pct * weights["role_overlap"]) +
        (location_pct * weights["location"]) +
        (comp_pct * weights["compensation"]) +
        (projects_pct * weights["projects"]) +
        (profile_completeness_pct * weights["profile_completeness"]) +
        (activity_pct * weights["activity"]),
        1
    )
    overall_score = min(100.0, max(10.0, overall_score))

    # Qualitative Rating
    if overall_score >= 85:
        qualitative_rating = "EXCELLENT MATCH"
    elif overall_score >= 70:
        qualitative_rating = "STRONG MATCH"
    elif overall_score >= 50:
        qualitative_rating = "MODERATE MATCH"
    else:
        qualitative_rating = "LOW MATCH"

    # -------------------------------------------------------------
    # STRENGTHS, GAPS & TRUTHFUL GAP-BASED RECOMMENDATIONS
    # -------------------------------------------------------------
    strengths = []
    gaps = []
    recommendations = []

    if matched_skills:
        strengths.append(f"Strong skill alignment on {', '.join(matched_skills[:4])}.")
    if education_pct >= 90:
        strengths.append("Required education degree satisfied.")
    if exp_relevance_pct >= 85:
        strengths.append("Relevant previous role domain aligns with target position.")
    if location_pct >= 90:
        strengths.append("Location requirement compatible.")

    if missing_skills:
        gaps.append(f"Missing core target skills: {', '.join(missing_skills[:4])}.")
        recommendations.append(f"Consider acquiring experience or certifications in missing skills: {', '.join(missing_skills[:3])}.")

    if required_exp_years > candidate_exp_years and not freshers_welcome:
        gaps.append(f"JD asks for {required_exp_years}+ years; {candidate_exp_years} years detected.")
        recommendations.append(f"Emphasize key achievements and leadership responsibilities to compensate for experience duration difference.")

    if keyword_recall_pct < 70:
        gaps.append("Keyword recall can be improved with target terminology.")
        recommendations.append("Incorporate specific action verbs and industry keywords from the Job Description into project bullet points.")

    if profile_completeness_pct < 90:
        recommendations.append("Complete missing profile details (such as LinkedIn URL or Certifications) to improve recruiter accessibility.")

    if not recommendations:
        recommendations.append("Your resume shows strong alignment with this job posting.")

    return {
        "overall_match_percentage": overall_score,
        "qualitative_rating": qualitative_rating,
        "eligibility": {
            "passed": eligibility_passed,
            "warnings": eligibility_warnings
        },
        "breakdown": {
            "skills": skills_match_pct,
            "experience": overall_exp_pct,
            "education": education_pct,
            "keyword_recall": keyword_recall_pct,
            "role_overlap": role_overlap_pct,
            "location": location_pct,
            "compensation": comp_pct,
            "projects": projects_pct,
            "profile_completeness": profile_completeness_pct,
            "activity": activity_pct
        },
        "skill_match": {
            "matching_skills": matched_skills,
            "missing_skills": missing_skills,
            "additional_skills": additional_skills,
            "match_percentage": skills_match_pct
        },
        "experience_match": {
            "required_years": f"{required_exp_years} Years" if required_exp_years > 0 else "Freshers Welcome",
            "candidate_years": f"{candidate_exp_years} Years",
            "duration_match_pct": exp_duration_pct,
            "role_relevance_pct": exp_relevance_pct,
            "overall_experience_pct": overall_exp_pct
        },
        "education_match": {
            "match_score": education_pct,
            "status": edu_status,
            "candidate_degrees": list(candidate_degrees)
        },
        "keyword_match": {
            "coverage_percentage": keyword_recall_pct,
            "missing_keywords": missing_keywords
        },
        "location_match": {
            "match_score": location_pct,
            "status": location_status
        },
        "compensation_match": {
            "match_score": comp_pct,
            "status": comp_status,
            "candidate_expected": cand_comp
        },
        "strengths": strengths if strengths else ["Profile meets general role structure."],
        "gaps": gaps if gaps else ["No major skill or experience gaps identified."],
        "recommendations": recommendations
    }
