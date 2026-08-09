import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Shield, CheckCircle2, AlertTriangle, FileText, Target, Sparkles,
  ArrowRight, Award, Lock, Zap, Search, ShieldCheck, HeartPulse,
  Briefcase, DollarSign, Users, ChevronRight
} from 'lucide-react';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-emerald-500 selection:text-white">
      {/* 1. Header Navigation */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img src="/logo.svg" alt="CareerShield Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">Career<span className="text-emerald-600">Shield</span></span>
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">Executive Career Platform</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-8 text-xs font-bold text-slate-600 uppercase tracking-wider">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Features</a>
            <a href="#ats-matrix" className="hover:text-emerald-600 transition-colors">11-Point ATS</a>
            <a href="#scam-detector" className="hover:text-emerald-600 transition-colors">Fake Job Audit</a>
            <a href="#domains" className="hover:text-emerald-600 transition-colors">Supported Fields</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="px-5 py-2.5 text-xs font-bold text-slate-700 hover:text-slate-900 transition-colors border border-slate-200 hover:border-slate-300 rounded-xl bg-white shadow-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="px-5 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-all rounded-xl shadow-md shadow-emerald-600/20 flex items-center gap-2"
            >
              Register Free <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section className="relative pt-16 pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold shadow-sm">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>100% Machine Learning & Rule-Engine Intelligence</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
            Land Your Next Job Safely with <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-700">
              11-Aspect ATS & Fake Job Audit
            </span>
          </h1>

          <p className="max-w-3xl mx-auto text-slate-600 text-base sm:text-lg font-medium leading-relaxed">
            CareerShield evaluates resumes across all career fields — from Healthcare, Sales, and Admin to Finance and Tech — using an executive 11-point inspection matrix and instant fake job scam detection.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm rounded-xl shadow-xl shadow-emerald-600/25 transition-all flex items-center justify-center gap-3"
            >
              Start Free Resume Audit <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 font-extrabold text-sm rounded-xl shadow-sm transition-all flex items-center justify-center gap-2"
            >
              Sign In to Dashboard
            </Link>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 pt-12 max-w-4xl mx-auto border-t border-slate-200">
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">11-Point</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">ATS Inspection Matrix</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">99.4%</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Scam Audit Precision</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-slate-900">All Fields</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Tech, Healthcare, Admin</p>
            </div>
            <div>
              <p className="text-3xl sm:text-4xl font-extrabold text-emerald-600">Supabase</p>
              <p className="text-xs font-semibold text-slate-500 mt-1 uppercase tracking-wider">Encrypted Cloud Storage</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 11-Point ATS Matrix Section */}
      <section id="ats-matrix" className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Comprehensive Intelligence</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">The 11-Aspect Resume Inspection Engine</h2>
            <p className="text-slate-600 text-sm font-medium">Unlike generic checkers that only look at keywords, CareerShield performs a holistic audit across 11 critical recruitment vectors.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: FileText, title: '1. Sections & Headers', desc: 'Validates standard section headings (Experience, Education, Skills, Summary).' },
              { icon: CheckCircle2, title: '2. ATS Essentials', desc: 'Verifies email, phone number, location, and clean layout compatibility.' },
              { icon: AlertTriangle, title: '3. HR Red Flags', desc: 'Flags employment gaps, missing dates, unprofessional emails, and buzzwords.' },
              { icon: Lock, title: '4. Discrimination & Bias', desc: 'Detects risky personal details (marital status, DOB, photos) that recruiters flag.' },
              { icon: Award, title: '5. Seniority & Leadership', desc: 'Measures management, strategy, ownership, and executive terminology.' },
              { icon: Target, title: '6. Tailoring & Keywords', desc: 'Evaluates domain-specific keywords across Healthcare, Sales, Admin, and Tech.' },
              { icon: Sparkles, title: '7. Spelling & Grammar', desc: 'Scores readability index, typo density, and clear sentence phrasing.' },
              { icon: Zap, title: '8. Quantifying Impact', desc: 'Checks for percentage growth, revenue numbers, team sizes, and metrics.' },
              { icon: ShieldCheck, title: '9. ATS Parse Rate', desc: 'Estimates how cleanly robotic software can extract your work history.' },
              { icon: Users, title: '10. Recruiter Reception', desc: 'Simulates a human hiring manager’s first 6-second skim test.' },
              { icon: CheckCircle2, title: '11. Bullet Consistency', desc: 'Ensures bullet length uniformity and action verb start consistency.' }
            ].map((aspect, idx) => (
              <div key={idx} className="human-card p-6 border border-slate-200 hover:border-emerald-500 transition-all hover:shadow-lg">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4 border border-emerald-100">
                  <aspect.icon className="w-5 h-5" />
                </div>
                <h3 className="text-base font-extrabold text-slate-900 mb-2">{aspect.title}</h3>
                <p className="text-slate-600 text-xs font-medium leading-relaxed">{aspect.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Multi-Domain Industry Section */}
      <section id="domains" className="py-20 px-6 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">Universal Career Support</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Tailored for Every Industry & Job Field</h2>
            <p className="text-slate-600 text-sm font-medium">CareerShield isn’t just for software developers. Our multi-domain NLP engine understands non-tech professions with high precision.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[
              { icon: HeartPulse, name: 'Healthcare & Doctors', skills: 'Patient Care, Triage, EHR, Surgery' },
              { icon: Briefcase, name: 'Hospitality & Admin', skills: 'Receptionist, Scheduling, CRM, Filing' },
              { icon: DollarSign, name: 'Sales & Business', skills: 'Cold Calling, Deals, Prospecting, B2B' },
              { icon: Users, name: 'Finance & Banking', skills: 'Auditing, Financial Models, Compliance' },
              { icon: Zap, name: 'Tech & Engineering', skills: 'Python, Full-Stack, Cloud, DevOps' }
            ].map((domain, i) => (
              <div key={i} className="human-card p-5 bg-white text-center border border-slate-200 shadow-sm hover:border-emerald-600 transition-all">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
                  <domain.icon className="w-6 h-6" />
                </div>
                <h4 className="font-extrabold text-slate-900 text-xs mb-1">{domain.name}</h4>
                <p className="text-[10px] text-slate-500 font-medium">{domain.skills}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Fake Job Detector Showcase */}
      <section id="scam-detector" className="py-20 px-6 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="text-xs font-bold text-rose-600 uppercase tracking-widest bg-rose-50 px-3 py-1 rounded-full border border-rose-200">Protection Engine</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">Stop Job Scams Before You Apply</h2>
            <p className="text-slate-600 text-sm font-medium leading-relaxed">
              Employment scams are at an all-time high. CareerShield’s ML model scans job postings for domain spoofing, suspicious payment demands, salary anomalies, and free email domains (Gmail/Yahoo for official offers).
            </p>

            <ul className="space-y-3 text-xs font-bold text-slate-700">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Instant Risk Score (0-100) & Genuine vs Fake Prediction</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Domain Verification & HTTPS Security Check</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Salary Anomaly Detection (Unrealistic Pay Promises)</span>
              </li>
            </ul>

            <div className="pt-2">
              <Link
                to="/register"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs rounded-xl shadow-lg transition-all"
              >
                Test Job Posting for Scams <ChevronRight className="w-4 h-4 text-emerald-400" />
              </Link>
            </div>
          </div>

          <div className="human-card p-6 bg-slate-50 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <span className="text-xs font-extrabold text-slate-900">Scam Audit Preview</span>
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold human-badge-rose">High Risk Flagged</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Domain Security</span>
                <span className="text-emerald-700 font-bold">HTTPS Verified</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Recruiter Email Check</span>
                <span className="text-rose-700 font-bold">Free Gmail Address Used</span>
              </div>
              <div className="p-3 bg-white rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700">Salary Assessment</span>
                <span className="text-rose-700 font-bold">+$120k Above Market Average</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action Banner */}
      <section className="py-20 px-6 bg-gradient-to-br from-slate-900 to-slate-800 text-white text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">Ready to Audit Your Resume & Avoid Scams?</h2>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl mx-auto font-medium">Join thousands of job seekers optimizing their ATS scores and securing legitimate career opportunities.</p>
          
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm rounded-xl shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Create Free Account <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-slate-700 hover:bg-slate-600 text-white font-extrabold text-sm rounded-xl transition-all"
            >
              Already Registered? Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Footer */}
      <footer className="py-12 px-6 bg-white border-t border-slate-200 text-slate-500 text-xs font-medium">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="CareerShield Logo" className="w-6 h-6 object-contain" />
            <span className="font-extrabold text-slate-900 text-sm">CareerShield</span>
            <span>© {new Date().getFullYear()} Platform. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-6 text-slate-600">
            <Link to="/login" className="hover:text-emerald-600">Login</Link>
            <Link to="/register" className="hover:text-emerald-600">Register</Link>
            <span className="text-slate-300">|</span>
            <Link to="/privacy-policy" className="hover:text-emerald-600">Privacy Policy</Link>
            <Link to="/terms-of-service" className="hover:text-emerald-600">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};
