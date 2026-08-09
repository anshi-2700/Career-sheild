import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  FileText,
  ShieldAlert,
  CheckCircle2,
  Briefcase,
  Activity,
  ArrowRight,
  Sparkles,
  Layers,
  Award
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const [resume, setResume] = useState<any>(null);
  const [fakeJobs, setFakeJobs] = useState<any[]>([]);
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [resResume, resFakeJobs, resLogs] = await Promise.allSettled([
          api.get('/resume/my-resume'),
          api.get('/fake-job/history'),
          api.get('/activity-logs')
        ]);

        if (resResume.status === 'fulfilled') setResume(resResume.value.data);
        if (resFakeJobs.status === 'fulfilled') setFakeJobs(resFakeJobs.value.data);
        if (resLogs.status === 'fulfilled') setLogs(resLogs.value.data);
      } catch (err) {
        console.error("Dashboard data load error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const getAtsGrade = (score: number) => {
    if (score >= 90) return { grade: 'A+ Exceptional', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 80) return { grade: 'A Recruiter Ready', badge: 'bg-emerald-100 text-emerald-800 border-emerald-300' };
    if (score >= 70) return { grade: 'B Good Profile', badge: 'bg-amber-100 text-amber-800 border-amber-300' };
    return { grade: 'Needs Optimization', badge: 'bg-rose-100 text-rose-800 border-rose-300' };
  };

  const atsGrade = resume ? getAtsGrade(resume.ats_score) : null;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-white border border-slate-200 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
              Executive Overview
            </span>
            {atsGrade && (
              <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full border ${atsGrade.badge}`}>
                {atsGrade.grade}
              </span>
            )}
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mt-3 tracking-tight">
            Career Safety & Intelligence Dashboard
          </h1>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium">
            Evaluate your resume against 12 weighted ATS compatibility categories, predict target job role matches, and audit job postings for recruitment fraud using explainable Machine Learning.
          </p>
          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/resume-upload"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
            >
              <FileText className="w-4 h-4" /> Upload / Scan Resume
            </Link>
            <Link
              to="/fake-job-detector"
              className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" /> Verify Job Posting
            </Link>
          </div>
        </div>
      </div>

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="human-card p-6 flex flex-col items-center justify-center text-center">
          <ScoreGauge
            score={resume ? resume.ats_score : 0}
            label="ATS Compatibility"
            sublabel="Overall Score"
            type="ats"
          />
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {resume ? "Composite score across 12 explainable ATS categories." : "No resume scanned yet."}
          </p>
        </div>

        <div className="human-card p-6 flex flex-col items-center justify-center text-center">
          <ScoreGauge
            score={resume ? resume.quality_score : 0}
            label="Content Quality"
            sublabel="Action Verbs & Grammar"
            type="quality"
          />
          <p className="text-xs text-slate-500 mt-2 font-medium">
            {resume ? "Industry dictionary match & action verb density." : "Upload resume to view score."}
          </p>
        </div>

        <div className="human-card p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Latest Job Risk Audit</span>
              <ShieldAlert className="w-4 h-4 text-rose-600" />
            </div>
            {fakeJobs.length > 0 ? (
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">{fakeJobs[0].risk_score}%</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded ${fakeJobs[0].prediction === 'Fake' ? 'human-badge-rose' : 'human-badge-emerald'}`}>
                    {fakeJobs[0].prediction}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mt-2 line-clamp-2 font-medium">
                  {fakeJobs[0].company_name} — {fakeJobs[0].flagged_reasons?.[0]}
                </p>
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 font-medium">No job analyses conducted yet. Upload screenshot or paste job posting text to scan.</p>
            )}
          </div>
          <Link to="/fake-job-detector" className="text-xs text-emerald-700 hover:text-emerald-800 font-bold flex items-center gap-1 mt-4">
            Open Scam Detector <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Predicted Roles & Skill Breakdown */}
        <div className="lg:col-span-2 space-y-6">
          <div className="human-card p-6">
            <div className="flex items-center justify-between mb-6 border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-emerald-600" />
                <h3 className="font-extrabold text-base text-slate-900">Predicted Job Roles (ML Confidence)</h3>
              </div>
              <span className="text-xs text-slate-500 font-medium">Full resume text NLP analysis</span>
            </div>

            {resume && resume.predicted_roles?.length > 0 ? (
              <div className="space-y-4">
                {resume.predicted_roles.map((item: any, idx: number) => (
                  <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-sm text-slate-900 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        {item.role}
                      </span>
                      <span className="text-xs font-bold text-emerald-800 human-badge-emerald px-2.5 py-0.5 rounded-full">
                        {item.confidence}% Match
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-3">
                      <div
                        className="h-full bg-emerald-600 rounded-full transition-all duration-700"
                        style={{ width: `${item.confidence}%` }}
                      ></div>
                    </div>
                    {item.matched_skills?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {item.matched_skills.map((s: string, sIdx: number) => (
                          <span key={sIdx} className="text-[11px] bg-white text-slate-700 border border-slate-200 px-2 py-0.5 rounded font-semibold">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl bg-slate-50">
                <Layers className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">No Resume Scanned Yet</p>
                <p className="text-xs text-slate-500 mt-1 mb-4 font-medium">Upload your resume to generate multi-domain job role predictions.</p>
                <Link to="/resume-upload" className="inline-flex items-center gap-2 text-xs bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg shadow-sm">
                  Go to Resume Upload
                </Link>
              </div>
            )}
          </div>

          {/* Recent Fake Job Analyses List */}
          <div className="human-card p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-rose-600" /> Recent Job Risk Audits
              </h3>
              <Link to="/fake-job-detector" className="text-xs text-emerald-700 hover:underline font-bold">
                Analyze New Job
              </Link>
            </div>
            {fakeJobs.length > 0 ? (
              <div className="space-y-3">
                {fakeJobs.slice(0, 4).map((j, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                    <div>
                      <p className="font-bold text-slate-900">{j.company_name}</p>
                      <p className="text-slate-500 text-[11px] mt-0.5 font-medium">{j.flagged_reasons?.[0]}</p>
                    </div>
                    <div className="text-right shrink-0 ml-4">
                      <span className={`font-bold px-2 py-0.5 rounded ${j.prediction === 'Fake' ? 'human-badge-rose' : 'human-badge-emerald'}`}>
                        {j.prediction} ({j.risk_score}%)
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 font-medium">No recent job risk checks conducted.</p>
            )}
          </div>
        </div>

        {/* Right 1 Col: Activity Stream */}
        <div className="space-y-6">
          <div className="human-card p-6">
            <div className="flex items-center justify-between mb-4 border-b border-slate-200 pb-3">
              <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-emerald-600" /> Platform Audit Trail
              </h3>
            </div>
            {logs.length > 0 ? (
              <div className="space-y-3">
                {logs.slice(0, 7).map((log, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-slate-800">{log.action}</p>
                      <p className="text-[10px] text-slate-500 mt-0.5 font-medium">{new Date(log.timestamp).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 font-medium">No activity logs recorded.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
