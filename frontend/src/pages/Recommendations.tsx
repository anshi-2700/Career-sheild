import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import {
  Lightbulb, CheckCircle2, ArrowRight, Copy, Check, Wand2, Edit3,
  Sparkles, Layers, ShieldCheck, FileText, ArrowDownRight, RefreshCw
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Recommendations: React.FC = () => {
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [completedItems, setCompletedItems] = useState<{ [key: string]: boolean }>({});
  const [editableTexts, setEditableTexts] = useState<{ [key: string]: string }>({});

  const navigate = useNavigate();

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const res = await api.get('/resume/my-resume');
      setResume(res.data);
      
      // Initialize editable texts with recommendation 'example_after' or suggestions
      if (res.data?.recommendations) {
        const initialTexts: { [key: string]: string } = {};
        res.data.recommendations.forEach((rec: any, idx: number) => {
          const key = rec.id || `rec_${idx}`;
          initialTexts[key] = rec.example_after || rec.suggestion || rec.why || '';
        });
        setEditableTexts(initialTexts);
      }
    } catch (err) {
      console.error("Fetch recommendations error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleCompleted = (id: string) => {
    setCompletedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleTextChange = (id: string, newText: string) => {
    setEditableTexts(prev => ({ ...prev, [id]: newText }));
  };

  if (loading) {
    return <div className="p-8 text-center text-slate-500 font-medium">Loading Tailored Resume Recommendations...</div>;
  }

  if (!resume || !resume.recommendations || resume.recommendations.length === 0) {
    return (
      <div className="human-card p-12 text-center space-y-4 max-w-xl mx-auto">
        <Lightbulb className="w-12 h-12 text-emerald-600 mx-auto" />
        <h3 className="text-xl font-bold text-slate-900">No Recommendations Available Yet</h3>
        <p className="text-sm text-slate-500 font-medium">Please upload or generate your resume to receive 1-click actionable improvements.</p>
        <Link to="/resume-upload" className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md">
          Upload Resume <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="p-8 rounded-2xl bg-white border border-slate-200 relative overflow-hidden shadow-sm">
        <div className="relative z-10 max-w-3xl">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-1 rounded-full">
            Actionable Improvement Plan
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 mt-3 tracking-tight flex items-center gap-2">
            <Lightbulb className="w-7 h-7 text-emerald-600" /> Easy-To-Use Resume Optimization Studio
          </h2>
          <p className="text-slate-600 text-sm mt-2 leading-relaxed font-medium">
            Review side-by-side <span className="font-bold text-slate-900">Before vs. After</span> improvements. You can edit any recommendation text directly on the page, check off completed items, or copy optimized text into your ATS Resume Builder.
          </p>
        </div>
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-6">
        {resume.recommendations.map((rec: any, idx: number) => {
          const itemKey = rec.id || `rec_${idx}`;
          const isDone = Boolean(completedItems[itemKey]);
          const currentEditableText = editableTexts[itemKey] || rec.example_after || rec.suggestion || '';

          return (
            <div
              key={itemKey}
              className={`human-card p-6 space-y-4 transition-all ${
                isDone ? 'opacity-60 bg-slate-50/80 border-slate-200' : 'bg-white border-slate-200 hover:border-emerald-500'
              }`}
            >
              {/* Category Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => toggleCompleted(itemKey)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                      isDone
                        ? 'bg-emerald-600 border-emerald-600 text-white'
                        : 'border-slate-300 hover:border-emerald-600 bg-white'
                    }`}
                  >
                    {isDone && <Check className="w-4 h-4" />}
                  </button>
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-3 py-0.5 rounded-full">
                    {rec.category || 'Resume Improvement'}
                  </span>
                  {rec.impact_tag && (
                    <span className="text-xs font-bold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
                      {rec.impact_tag}
                    </span>
                  )}
                </div>

                <span className="text-xs text-slate-400 font-mono font-bold">
                  {isDone ? '✓ Completed' : `Item #${idx + 1}`}
                </span>
              </div>

              {/* Title & Plain English Suggestion */}
              <div>
                <h3 className={`font-extrabold text-base text-slate-900 ${isDone ? 'line-through text-slate-500' : ''}`}>
                  {rec.title || rec.suggestion}
                </h3>
                <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                  {rec.suggestion || rec.why}
                </p>
              </div>

              {/* Before vs After Side-by-Side Comparison */}
              {(rec.example_before || rec.example_after) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-1">
                  {/* Weak Version */}
                  {rec.example_before && (
                    <div className="p-3.5 bg-rose-50/70 border border-rose-200/80 rounded-xl space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-rose-700 tracking-wider block">
                        ❌ Weak / Current Bullet
                      </span>
                      <p className="text-slate-800 font-mono text-[11px] leading-relaxed">
                        {rec.example_before}
                      </p>
                    </div>
                  )}

                  {/* Recruiter-Optimized Version */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold uppercase text-emerald-800 tracking-wider flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" /> ✅ Recommended Improved Bullet
                      </span>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1 font-bold">
                        <Edit3 className="w-3 h-3" /> Editable Below
                      </span>
                    </div>

                    {/* Inline Editable Text Area */}
                    <textarea
                      rows={3}
                      value={currentEditableText}
                      onChange={(e) => handleTextChange(itemKey, e.target.value)}
                      className="w-full p-2.5 bg-white border border-emerald-300 rounded-lg text-slate-900 font-mono text-[11px] leading-relaxed focus:outline-none focus:border-emerald-600 shadow-xs"
                    />

                    {/* Quick Action Buttons */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleCopy(currentEditableText, itemKey)}
                        className="px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-[11px] rounded-lg transition-all flex items-center gap-1.5 shadow-xs"
                      >
                        {copiedId === itemKey ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700 font-bold">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-slate-600" />
                            <span>Copy Improved Text</span>
                          </>
                        )}
                      </button>

                      <Link
                        to="/resume-builder"
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-[11px] rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                      >
                        <Wand2 className="w-3.5 h-3.5" /> Apply in Resume Builder
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
