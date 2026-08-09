import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Shield, Activity, Server, Clock, RefreshCw, CheckCircle2, AlertTriangle,
  Users, Database, FileSearch, ShieldAlert, Cpu, ArrowUpRight, Zap, Lock
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminDashboard: React.FC = () => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [retention, setRetention] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [msg, setMsg] = useState('');

  const [resumeDays, setResumeDays] = useState(40);
  const [fakeJobDays, setFakeJobDays] = useState(90);
  const [activityDays, setActivityDays] = useState(180);

  const fetchAdminData = async () => {
    try {
      const [resAnalytics, resRetention] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/retention')
      ]);
      setAnalytics(resAnalytics.data);
      setRetention(resRetention.data);

      setResumeDays(resRetention.data.resume_retention_days || 40);
      setFakeJobDays(resRetention.data.fake_job_retention_days || 90);
      setActivityDays(resRetention.data.activity_log_retention_days || 180);
    } catch (err) {
      console.error("Fetch admin data error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleUpdateRetention = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdating(true);
    setMsg('');

    try {
      await api.put('/admin/retention', {
        resume_retention_days: Number(resumeDays),
        fake_job_retention_days: Number(fakeJobDays),
        activity_log_retention_days: Number(activityDays)
      });
      setMsg('Retention policy updated & automated cleanup executed successfully!');
      fetchAdminData();
    } catch (err: any) {
      setMsg('Failed to update retention config.');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading Super Admin Command Center...</div>;
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Super Admin Executive Control Header */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute -right-10 -bottom-10 opacity-10 pointer-events-none">
          <Shield className="w-80 h-80 text-rose-500" />
        </div>

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-extrabold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                <Lock className="w-3 h-3 text-rose-400" /> Super Admin Privilege Level
              </span>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-extrabold uppercase tracking-widest rounded-full flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> Systems Live
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/user-management"
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-1.5"
              >
                <Users className="w-4 h-4" /> User RBAC Directory <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <Shield className="w-8 h-8 text-rose-500" /> SUPER ADMIN CONTROL CENTER
            </h1>
            <p className="text-slate-400 text-xs mt-1 max-w-2xl font-medium leading-relaxed">
              Global system monitoring dashboard, platform analytics, database storage health, multi-tenant RBAC policies, and automated cleanup rules.
            </p>
          </div>

          <div className="pt-2 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-t border-slate-800">
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Database Engine</span>
              <span className="font-extrabold text-slate-200 flex items-center gap-1">
                <Database className="w-3.5 h-3.5 text-emerald-400" /> Supabase PostgreSQL
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Storage Provider</span>
              <span className="font-extrabold text-slate-200 flex items-center gap-1">
                <Server className="w-3.5 h-3.5 text-blue-400" /> Supabase Storage
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">Scam Detector OCR</span>
              <span className="font-extrabold text-slate-200 flex items-center gap-1">
                <Cpu className="w-3.5 h-3.5 text-purple-400" /> PyMuPDF & Tesseract
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold uppercase block">ATS Scoring Engine</span>
              <span className="font-extrabold text-slate-200 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-400" /> 12-Aspect NLP Matrix
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="human-card p-6 space-y-3 bg-white border-l-4 border-l-emerald-600">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Total Registered Users</span>
            <div className="p-2 bg-emerald-50 text-emerald-700 rounded-lg">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{analytics?.total_users || 0}</p>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-100">
            <span>Active: <span className="text-emerald-700">{analytics?.active_users || 0}</span></span>
            <span className="text-slate-400">|</span>
            <span>Role: <span className="text-slate-900">RBAC Enforced</span></span>
          </div>
        </div>

        <div className="human-card p-6 space-y-3 bg-white border-l-4 border-l-rose-600">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Jobs & Scam Audits</span>
            <div className="p-2 bg-rose-50 text-rose-700 rounded-lg">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{analytics?.jobs_analyzed || 0}</p>
          <div className="flex items-center justify-between text-[11px] font-bold text-rose-700 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" /> {analytics?.fake_jobs_detected || 0} Scam Jobs Flagged
            </span>
          </div>
        </div>

        <div className="human-card p-6 space-y-3 bg-white border-l-4 border-l-blue-600">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Avg Platform ATS Score</span>
            <div className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <FileSearch className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-blue-700 tracking-tight">{analytics?.avg_ats_score || 0}%</p>
          <div className="flex items-center justify-between text-[11px] font-bold text-slate-600 pt-1 border-t border-slate-100">
            <span>Resumes Analyzed: <span className="text-slate-900">{analytics?.resumes_stored || 0}</span></span>
          </div>
        </div>

        <div className="human-card p-6 space-y-3 bg-white border-l-4 border-l-purple-600">
          <div className="flex items-center justify-between text-slate-500 font-medium">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-900">Database Storage Health</span>
            <div className="p-2 bg-purple-50 text-purple-700 rounded-lg">
              <Server className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 tracking-tight">{analytics?.storage_usage_mb || 0} MB</p>
          <div className="flex items-center justify-between text-[11px] font-bold text-emerald-700 pt-1 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span> {analytics?.system_health || 'Operational'}
            </span>
          </div>
        </div>
      </div>

      {/* Retention Policy Configuration Section */}
      <div className="human-card p-8 space-y-6 max-w-4xl border-slate-300 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div>
            <h3 className="font-extrabold text-base text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-emerald-600" /> Automated Data Retention & Cleanup Engine
            </h3>
            <p className="text-xs text-slate-500 mt-1 font-medium">Configure automatic purging thresholds to clear expired storage blobs and DB records.</p>
          </div>
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
            Auto-Cron Active
          </span>
        </div>

        {msg && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-bold">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {msg}
          </div>
        )}

        <form onSubmit={handleUpdateRetention} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Inactive Resumes (Days)
              </label>
              <input
                type="number"
                value={resumeDays}
                onChange={(e) => setResumeDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-slate-500 block font-medium">Default: 40 Days</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Fake Job Audits (Days)
              </label>
              <input
                type="number"
                value={fakeJobDays}
                onChange={(e) => setFakeJobDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-slate-500 block font-medium">Default: 90 Days</span>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
              <label className="block text-xs font-bold text-slate-900 uppercase tracking-wider">
                Activity Logs (Days)
              </label>
              <input
                type="number"
                value={activityDays}
                onChange={(e) => setActivityDays(Number(e.target.value))}
                className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-xl text-slate-900 text-sm font-bold focus:outline-none focus:border-emerald-600"
              />
              <span className="text-[10px] text-slate-500 block font-medium">Default: 180 Days</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={updating}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all text-xs flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${updating ? 'animate-spin' : ''}`} /> Save Retention Rules & Execute Immediate System Cleanup
          </button>
        </form>
      </div>
    </div>
  );
};
