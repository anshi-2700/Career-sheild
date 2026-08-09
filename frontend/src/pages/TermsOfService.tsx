import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FileText, CheckCircle2, ShieldAlert, Scale, ArrowLeft } from 'lucide-react';

export const TermsOfService: React.FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-6">
          <div className="flex items-center gap-3">
            <img src="/logo.svg" alt="CareerShield Logo" className="w-10 h-10 object-contain drop-shadow-sm" />
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Career<span className="text-emerald-600">Shield</span>
              </h1>
              <p className="text-xs text-slate-500 font-semibold">Terms of Service & Platform Usage Agreement</p>
            </div>
          </div>

          <Link
            to="/"
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>

        {/* Hero Alert Banner */}
        <div className="p-6 rounded-2xl bg-blue-50 border border-blue-200 text-blue-900 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-blue-800 font-extrabold text-sm uppercase tracking-wide">
            <Scale className="w-5 h-5 text-blue-600" /> Platform Usage & Legal Agreement
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            By accessing or creating an account on CareerShield, you agree to comply with the terms and conditions outlined below. Our platform provides automated resume intelligence, ATS optimization, and machine learning fraud risk scoring.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
          
          <section className="human-card p-6 bg-white border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" /> 1. Acceptable Platform Use
            </h2>
            <p className="text-xs text-slate-600">Users agree to utilize CareerShield strictly for lawful career development and recruitment verification purposes:</p>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 font-semibold pl-2">
              <li>Upload only truthful resume content that represents your actual work experience.</li>
              <li>Do not attempt to bypass role-based access control (RBAC) or exploit system API endpoints.</li>
              <li>Do not submit malicious software or corrupted files for OCR processing.</li>
            </ul>
          </section>

          <section className="human-card p-6 bg-white border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldAlert className="w-5 h-5 text-amber-600" /> 2. Fake Job Detector Risk Analysis Disclaimer
            </h2>
            <p className="text-xs text-slate-600">Our Fake Job Detector utilizes machine learning algorithms, NLP heuristics, domain WHOIS verification, and salary anomaly scoring:</p>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 font-semibold pl-2">
              <li>Risk scores and anomaly badges are generated for informational assistance to help candidates identify potential employment scams.</li>
              <li>CareerShield provides fraud probability assessments but does not guarantee employment outcomes or official legal representation.</li>
              <li>Candidates are encouraged to exercise independent caution before sharing financial or sensitive identity documents with prospective employers.</li>
            </ul>
          </section>

          <section className="human-card p-6 bg-white border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileText className="w-5 h-5 text-purple-600" /> 3. Candidate Data Ownership & Rights
            </h2>
            <p className="text-xs text-slate-600">
              Candidates retain full ownership of all uploaded resume documents and generated PDF reports. CareerShield claims no intellectual property rights over your personal career history. You may delete your uploaded data or account at any time.
            </p>
          </section>

          <section className="human-card p-6 bg-white border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Scale className="w-5 h-5 text-blue-600" /> 4. Terms Modifications
            </h2>
            <p className="text-xs text-slate-600">
              CareerShield reserves the right to update these terms to reflect feature enhancements or legal requirements. Continued use of the service constitutes acceptance of updated terms.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="pt-6 border-t border-slate-200 text-center text-xs text-slate-500 font-semibold">
          © {new Date().getFullYear()} CareerShield Platform. All rights reserved.
        </div>

      </div>
    </div>
  );
};
