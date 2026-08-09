# CareerShield — ML-Powered Fake Job Detection & Resume Intelligence Platform

**Final Year BCA Project (v1.0)**  
*Web Application built with FastAPI, React, TypeScript, Scikit-Learn, and Tailwind CSS.*

---

## 🌟 Executive Overview

**CareerShield** is an end-to-end career intelligence platform that protects job seekers from recruitment fraud while helping them optimize their resumes for Applicant Tracking Systems (ATS) and specific job descriptions.

### Key Highlights
- **100% Zero Paid API Dependency**: Powered entirely by local Python Machine Learning models, Scikit-Learn, TF-IDF vectorizers, and spaCy/NLTK/regex rule engines.
- **Fake Job & Scam Detection**: Random Forest & Logistic Regression ML Classifier combined with a rule matrix detecting Telegram/WhatsApp interview traps, registration fee demands, crypto payments, disposable email domains, salary anomalies, and company website validation.
- **Resume Intelligence & Parsing**: Parses PDF/DOCX resumes, calculates ATS layout compatibility, analyzes spelling & grammar, computes quality scores, and predicts suitable job roles with confidence percentages.
- **Resume vs Job Description Matcher**: Cosine similarity & TF-IDF keyword coverage, matching/missing/extra skill matrix, experience gap meter, and overall match percentage.
- **Super Admin Governance**: Role-Based Access Control (RBAC), user suspension/deletion, platform analytics, system health monitoring, and automated data retention policy enforcement (40-day resume cleanup, 90-day fake job purge, 180-day activity log archiving).
- **Downloadable PDF Reports**: One-click generation of professional summary PDF reports.

---

## 🚀 Quick Start Guide

### 1. Start the FastAPI Backend (Port 8000)
```bash
cd backend
pip install -r requirements.txt
python run.py
```
*The FastAPI server will automatically initialize SQLite database tables (`careershield.db`), pre-train the ML models, and seed default user/admin accounts.*

- **Swagger Documentation**: http://127.0.0.1:8000/docs
- **Default Super Admin**: `admin@careershield.com` / `Admin@123456`
- **Default Job Seeker**: `user@careershield.com` / `User@123456`

### 2. Start the React Frontend (Port 5173)
```bash
cd frontend
npm install
npm run dev
```
- Open http://localhost:5173 in your browser.

---

## 🛠️ Technology Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide Icons, Axios |
| **Backend** | FastAPI, Python 3.13, Pydantic v2, SQLAlchemy, Uvicorn |
| **Database** | SQLite (Default local runnability) / PostgreSQL / Supabase ready |
| **Machine Learning** | Scikit-Learn (Random Forest, TF-IDF Vectorizer), NumPy, Pandas |
| **Document Parsing** | PyMuPDF (`fitz`), `python-docx`, `pdfplumber` |
| **PDF Reporting** | ReportLab |

---

## 📊 Modules Included

1. **Authentication & RBAC**: JWT Bearer authentication with User & Super Admin role permissions.
2. **Executive Dashboard**: Score gauges for ATS, Quality, Risk Score, Predicted Job Roles, and recent audit history.
3. **Resume Parser**: PDF/DOCX drag-and-drop text extraction.
4. **Resume Intelligence**: ATS score, grammar/spelling metrics, readability index.
5. **Job Role Prediction**: Multi-class skill vector classification with confidence %.
6. **Fake Job Detector**: Risk score 0-100%, prediction label (Fake / Genuine), scam trigger list.
7. **Job Description Matcher**: Side-by-side skill gap matrix and overall match %.
8. **Recommendation Engine**: Actionable suggestions explaining "Why".
9. **Super Admin Panel**: User list management, account suspension toggle, data retention config.
