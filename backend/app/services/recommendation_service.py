def generate_resume_recommendations(parsed_data: dict, ats_results: dict, grammar_results: dict) -> list:
    """
    Generates plain-English, actionable resume recommendations with ready-to-copy 'Before vs After' examples.
    """
    recommendations = []
    raw_text = parsed_data.get("raw_text", "").lower()
    skills = [s.lower() for s in parsed_data.get("skills", [])]

    # 1. Quantifiable Impact & Numbers
    has_metrics = any(char in raw_text for char in ["%", "$", "+"]) or any(kw in raw_text for kw in ["reduced", "increased", "boosted", "users", "records", "latency"])
    if not has_metrics:
        recommendations.append({
            "id": "rec_metrics",
            "category": "Measurable Impact & Metrics",
            "title": "Add Numbers, Percentages (%), or Scale to Your Bullet Points",
            "suggestion": "Recruiters and ATS algorithms heavily reward measurable results over generic task descriptions.",
            "example_before": "Implemented event-driven workflows for dashboard performance.",
            "example_after": "Implemented event-driven workflows and pre-aggregated summaries, reducing dashboard query latency by 35% across 500+ active records.",
            "impact_tag": "+10 ATS Score Boost",
            "difficulty": "Easy to Change"
        })

    # 2. Database Keyword Precision (PostgreSQL / SQL)
    if "supabase" in raw_text and "postgresql" not in raw_text:
        recommendations.append({
            "id": "rec_db_keywords",
            "category": "Database Keywords",
            "title": "Explicitly List 'PostgreSQL' Alongside 'Supabase'",
            "suggestion": "Listing platform tools like 'Supabase Auth' without mentioning 'PostgreSQL' misses major ATS database keywords.",
            "example_before": "Databases: Supabase Auth, Supabase Database",
            "example_after": "Databases & Services: PostgreSQL, Supabase Auth, Firebase, REST APIs",
            "impact_tag": "+5 ATS Keyword Match",
            "difficulty": "1-Click Copy"
        })

    # 3. Categorize Technical Skills
    has_categories = any(cat in raw_text for cat in ["frontend", "backend", "programming languages", "databases", "cloud & tools"])
    if not has_categories:
        recommendations.append({
            "id": "rec_skills_cat",
            "category": "Skills Section Formatting",
            "title": "Organize Skills into Clear ATS Categories",
            "suggestion": "Group your skills under distinct headings to help both ATS parsers and recruiters scan your stack in under 6 seconds.",
            "example_before": "Skills: Python, TypeScript, React, Next.js, FastAPI, PostgreSQL, Git, Docker",
            "example_after": "• Languages: Python, TypeScript, JavaScript, C#\n• Frontend: React.js, Next.js, Tailwind CSS\n• Backend: FastAPI, REST APIs, Python\n• Databases & Tools: PostgreSQL, Supabase, Git, Docker",
            "impact_tag": "+8 Formatting Grade",
            "difficulty": "1-Click Copy"
        })

    # 4. Work Experience / Internship Section
    has_formal_exp = "experience" in raw_text or "internship" in raw_text
    if not has_formal_exp:
        recommendations.append({
            "id": "rec_exp",
            "category": "Work Experience Section",
            "title": "Add an 'Experience' or 'Internship' Heading",
            "suggestion": "If you performed client work, freelance projects, open-source contributions, or hackathons, list them under an Experience heading.",
            "example_before": "Only Academic Projects listed.",
            "example_after": "WORK EXPERIENCE & CONTRIBUTIONS\nFull Stack Developer Intern / Freelance Project Lead | 2024\n• Architected multi-tenant SaaS hospital platform supporting RBAC and inventory management.",
            "impact_tag": "+12 Experience Points",
            "difficulty": "Easy Edit"
        })

    # 5. Social & Professional Links
    if "github.com" not in raw_text or "linkedin.com" not in raw_text:
        recommendations.append({
            "id": "rec_links",
            "category": "Contact Header Links",
            "title": "Add Clickable LinkedIn and GitHub Profile Links",
            "suggestion": "Include complete profile URLs at the very top of your contact header so hiring managers can view live code repositories.",
            "example_before": "Email: user@example.com | Phone: 9876543210",
            "example_after": "Email: user@example.com | Phone: 9876543210 | LinkedIn: linkedin.com/in/yourprofile | GitHub: github.com/yourusername",
            "impact_tag": "+5 Contact Points",
            "difficulty": "Instant Change"
        })

    # 6. Action Verbs
    action_verbs = grammar_results.get("action_verbs_used", [])
    if len(action_verbs) < 4:
        recommendations.append({
            "id": "rec_verbs",
            "category": "Action Verb Impact",
            "title": "Start Every Bullet Point with a Strong Action Verb",
            "suggestion": "Use powerful engineering action verbs like Architected, Developed, Spearheaded, Optimized, and Automated.",
            "example_before": "Worked on building face recognition system for attendance.",
            "example_after": "Engineered a real-time face recognition attendance system using OpenCV and Python, achieving 98.4% detection accuracy.",
            "impact_tag": "+6 Quality Score",
            "difficulty": "Easy Edit"
        })

    return recommendations
