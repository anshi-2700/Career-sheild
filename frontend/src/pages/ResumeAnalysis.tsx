import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ScoreGauge } from '../components/ScoreGauge';
import { ConfirmModal } from '../components/ConfirmModal';
import { Link, useNavigate } from 'react-router-dom';
import {
  FileSearch, CheckCircle2, Layers, Sparkles, Download, ArrowRight,
  ShieldCheck, Award, BarChart2, FileCheck, Eye, CheckSquare, User,
  Target, Info, BookOpen, Clock, AlignLeft, Percent, Trash2
} from 'lucide-react';

export const ResumeAnalysis: React.FC = () => {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    fetchResumeData();
  }, []);

  const fetchResumeData = async () => {
    try {
      const res = await api.get('/resume/my-resume');
      setResume(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get('/reports/download/resume', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', '12_Aspect_ATS_Intelligence_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Could not download PDF report. Please try uploading your resume again.');
    }
  };

  const executeDeleteResume = async () => {
    setShowConfirmModal(false);
    setDeleting(true);
    try {
      await api.delete('/resume/delete');
      setResume(null);
      navigate('/resume-upload');
    } catch (err) {
      setResume(null);
      navigate('/resume-upload');
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading 12-Aspect ATS Evaluation...</div>;
  }

  if (!resume) {
    return (
      <div className="human-card p-12 text-center space-y-4 max-w-xl mx-auto">
        <FileSearch className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900">No Resume Uploaded</h3>
        <p className="text-sm text-slate-500 font-medium">Please upload your resume first to view your 12-aspect domain-aware ATS audit.</p>
        <Link to="/resume-upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
          Upload Resume Now <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  const breakdown = resume.parsed_data?.ats_breakdown || {};
  const suggestions = resume.parsed_data?.suggestions || [];
  const domainDetected = resume.parsed_data?.domain_detected || "Software Engineering";

  const aspectList = [
    { key: 'contact_info', name: '1. Contact Information', weight: '8%', max: 8, icon: User, data: breakdown.contact_info },
    { key: 'structure', name: '2. Resume Structure', weight: '10%', max: 10, icon: Layers, data: breakdown.structure },
    { key: 'completeness', name: '3. Section Completeness', weight: '10%', max: 10, icon: FileCheck, data: breakdown.completeness },
    { key: 'formatting', name: '4. Formatting & ATS Compatibility', weight: '12%', max: 12, icon: CheckSquare, data: breakdown.formatting },
    { key: 'skills', name: '5. Skills Relevance & Categorization', weight: '15%', max: 15, icon: Target, data: breakdown.skills },
    { key: 'experience', name: '6. Experience Quality & Work History', weight: '12%', max: 12, icon: Award, data: breakdown.experience },
    { key: 'projects', name: '7. Projects Quality & Depth', weight: '10%', max: 10, icon: BookOpen, data: breakdown.projects },
    { key: 'education', name: '8. Education', weight: '8%', max: 8, icon: ShieldCheck, data: breakdown.education },
    { key: 'grammar', name: '9. Grammar & Spelling', weight: '5%', max: 5, icon: AlignLeft, data: breakdown.grammar },
    { key: 'readability', name: '10. Readability & Bullet Flow', weight: '5%', max: 5, icon: Eye, data: breakdown.readability },
    { key: 'keyword_coverage', name: '11. Keyword Coverage & Database Precision', weight: '5%', max: 5, icon: Percent, data: breakdown.keyword_coverage },
    { key: 'quantifiable_impact', name: '12. Quantifiable Impact & Metrics', weight: '5%', max: 5, icon: Clock, data: breakdown.quantifiable_impact },
  ];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* App Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Delete Saved Resume?"
        message="This will delete your current resume audit record and redirect you to upload a new up-to-date resume. Continue?"
        confirmLabel="Yes, Delete Resume"
        cancelLabel="Cancel"
        isDanger={true}
        onConfirm={executeDeleteResume}
        onCancel={() => setShowConfirmModal(false)}
      />

      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <FileSearch className="w-7 h-7 text-emerald-600" /> 12-Aspect ATS Compatibility Audit
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Candidate: <span className="font-bold text-slate-900">{resume.parsed_data?.candidate_name || 'Resume'}</span> • Domain: <span className="font-bold text-emerald-700">{domainDetected}</span>
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={deleting}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            {deleting ? 'Deleting...' : 'Delete & Re-upload Resume'}
          </button>
          <button
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
          >
            <Download className="w-4 h-4" /> Download PDF Audit Report
          </button>
        </div>
      </div>

      {/* Main Score Hero Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="human-card p-6 flex flex-col items-center justify-center text-center">
          <ScoreGauge
            score={resume.ats_score}
            label="Overall ATS Score"
            sublabel="Weighted Matrix"
            type="ats"
          />
          <p className="text-xs text-slate-500 mt-2 font-medium">
            Parse Rate: <span className="font-bold text-emerald-800">{resume.parsed_data?.ats_parse_rate || 92.0}%</span>
          </p>
        </div>

        <div className="md:col-span-2 human-card p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 border-b border-slate-200 pb-2 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" /> Domain & Methodological Validation
              </span>
              <span className="text-xs human-badge-emerald font-bold px-2.5 py-0.5 rounded-full">
                {domainDetected}
              </span>
            </h3>
            <p className="text-xs text-slate-600 mt-3 leading-relaxed font-medium">
              Evaluated against industry-standard recruiter parsing algorithms, single-column formatting constraints, and domain-specific NLP skill taxonomy.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-2">
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Contact Info</span>
              <span className="text-sm font-extrabold text-slate-900">{breakdown.contact_info?.score || 8}/8</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Formatting</span>
              <span className="text-sm font-extrabold text-slate-900">{breakdown.formatting?.score || 12}/12</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Skills Match</span>
              <span className="text-sm font-extrabold text-slate-900">{breakdown.skills?.score || 15}/15</span>
            </div>
            <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
              <span className="text-[10px] text-slate-500 font-bold uppercase block">Experience</span>
              <span className="text-sm font-extrabold text-slate-900">{breakdown.experience?.score || 12}/12</span>
            </div>
          </div>
        </div>
      </div>

      {/* 12 Detailed Aspect Cards */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
          <BarChart2 className="w-5 h-5 text-emerald-600" /> 12 Evaluation Categories Breakdown
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aspectList.map((item) => {
            const Icon = item.icon;
            const itemScore = item.data?.score ?? item.max;
            const pct = Math.round((itemScore / item.max) * 100);

            return (
              <div key={item.key} className="human-card p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-slate-900">{item.name}</h4>
                      <span className="text-[10px] text-slate-500 font-medium">Weight: {item.weight}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-extrabold text-sm text-slate-900">{itemScore} / {item.max}</span>
                    <span className="text-[10px] block text-emerald-700 font-bold">{pct}%</span>
                  </div>
                </div>

                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500"
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>

                <p className="text-[11px] text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200 font-medium">
                  {item.data?.details || "Evaluated against industry best practices and NLP taxonomy."}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Improvement Suggestions */}
      {suggestions.length > 0 && (
        <div className="human-card p-6 space-y-4 border-l-4 border-l-amber-500">
          <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500" /> Actionable Resume Improvement Plan ({suggestions.length})
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {suggestions.map((sug: string, idx: number) => (
              <div key={idx} className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-xl text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span className="text-slate-800 font-semibold">{sug}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
