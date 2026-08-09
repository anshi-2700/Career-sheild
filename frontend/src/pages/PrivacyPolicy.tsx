import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Shield, Lock, Eye, Server, ArrowLeft, CheckCircle2 } from 'lucide-react';

export const PrivacyPolicy: React.FC = () => {
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
              <p className="text-xs text-slate-500 font-semibold">Privacy Policy & Data Protection Guarantee</p>
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
        <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 space-y-2 shadow-sm">
          <div className="flex items-center gap-2 text-emerald-800 font-extrabold text-sm uppercase tracking-wide">
            <Lock className="w-5 h-5 text-emerald-600" /> 100% Confidentiality & Data Encryption Guarantee
          </div>
          <p className="text-xs text-slate-700 font-medium leading-relaxed">
            At CareerShield, we prioritize candidate privacy and security. Your candidate profile data, uploaded resumes, phone numbers, and job application scans are encrypted and never sold, rented, or shared with third-party data brokers.
          </p>
        </div>

        {/* Policy Content Sections */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed font-medium">
          
          <section className="human-card p-6 bg-white border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Eye className="w-5 h-5 text-emerald-600" /> 1. Information We Collect
            </h2>
            <p className="text-xs text-slate-600">We collect essential information required to parse your resume, score ATS compatibility, and analyze job posting authenticity:</p>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 font-semibold pl-2">
              <li><strong className="text-slate-900">Account Credentials:</strong> Full name, verified email address, phone number, and encrypted passwords.</li>
              <li><strong className="text-slate-900">Resume & Career Profile Data:</strong> Work history, educational qualifications, technical skills, projects, and contact information extracted from uploaded PDF/DOCX files.</li>
              <li><strong className="text-slate-900">Job Description Submissions:</strong> Job text, company names, and screenshots submitted for fake job scam analysis.</li>
            </ul>
          </section>

          <section className="human-card p-6 bg-white border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Server className="w-5 h-5 text-blue-600" /> 2. How We Use Your Information
            </h2>
            <p className="text-xs text-slate-600">Your submitted data is utilized exclusively for career protection features within your account:</p>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 font-semibold pl-2">
              <li>Executing 12-aspect ATS resume audits, grammar evaluations, and role predictions.</li>
              <li>Running machine learning models to detect fraudulent recruitment scams and fake job offers.</li>
              <li>Generating tailored multi-layout resume PDFs and customized recommendation reports.</li>
            </ul>
          </section>

          <section className="human-card p-6 bg-white border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Shield className="w-5 h-5 text-rose-600" /> 3. Automated Data Retention & Deletion Policy
            </h2>
            <p className="text-xs text-slate-600">To protect candidate privacy and optimize database storage health, CareerShield enforces automated retention policies:</p>
            <ul className="list-disc list-inside space-y-2 text-xs text-slate-700 font-semibold pl-2">
              <li>Inactive candidate resumes are automatically purged after 40 days.</li>
              <li>Fake job scan history logs are automatically purged after 90 days.</li>
              <li>System activity audit logs are permanently removed after 180 days.</li>
              <li>Users can request immediate account and data deletion at any time.</li>
            </ul>
          </section>

          <section className="human-card p-6 bg-white border-slate-200 shadow-sm space-y-3">
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CheckCircle2 className="w-5 h-5 text-purple-600" /> 4. Contact Us
            </h2>
            <p className="text-xs text-slate-600">
              If you have any questions regarding our Privacy Policy or data protection practices, please contact our support team at <span className="text-emerald-700 font-bold">privacy@careershield.com</span>.
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
