import React, { useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  GitCompare, CheckCircle2, XCircle, AlertCircle, ArrowRight, Sparkles,
  ShieldAlert, Award, MapPin, DollarSign, Briefcase, GraduationCap,
  Clock, CheckSquare, Lightbulb, FileText
} from 'lucide-react';

export const JobMatcher: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [candidateLocation, setCandidateLocation] = useState('');
  const [expectedSalary, setExpectedSalary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [matchResult, setMatchResult] = useState<any>(null);

  const handleMatch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Please paste target Job Description text.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/job/match', {
        job_title: jobTitle || 'Target Role',
        job_description: jobDescription,
        candidate_location: candidateLocation || undefined,
        candidate_expected_salary: expectedSalary || undefined
      });
      setMatchResult(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Job matching analysis failed. Make sure you uploaded your resume first.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <GitCompare className="w-7 h-7 text-emerald-600" /> Resume ↔ JD Multi-Factor Matching Engine
        </h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Hybrid AI matching system using skill taxonomy normalization, 10-dimension weighted compatibility scoring, Level 1 eligibility checks, and truthful gap-based recommendations across any career domain.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={handleMatch} className="human-card p-6 space-y-4 bg-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Financial Analyst / Data Analyst / Digital Marketing Manager"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Candidate Location (Optional)</label>
            <input
              type="text"
              value={candidateLocation}
              onChange={(e) => setCandidateLocation(e.target.value)}
              placeholder="e.g. Hyderabad / Bangalore / Remote"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-600 font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Expected Salary (Optional)</label>
            <input
              type="text"
              value={expectedSalary}
              onChange={(e) => setExpectedSalary(e.target.value)}
              placeholder="e.g. ₹6–8 LPA or $80,000"
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs focus:outline-none focus:border-emerald-600 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Target Job Description</label>
          <textarea
            rows={7}
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste target Job Description text here..."
            className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 text-xs font-mono focus:outline-none focus:border-emerald-600"
          />
        </div>

        <button
          type="submit"
          disabled={loading || !jobDescription.trim()}
          className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? 'Executing Skill Taxonomy Normalization & 10-Dimension Analysis...' : 'Run 10-Factor Job Matcher'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Match Result Display */}
      {matchResult && (
        <div className="space-y-8 pt-6 border-t border-slate-200">
          
          {/* Level 1 Eligibility Warning Banner */}
          {matchResult.eligibility && !matchResult.eligibility.passed && (
            <div className="p-4 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-900 space-y-2">
              <div className="flex items-center gap-2 text-rose-700 font-extrabold text-sm uppercase tracking-wide">
                <ShieldAlert className="w-5 h-5 text-rose-600" /> Level 1 Eligibility Warning — Hard Requirements Flagged
              </div>
              <ul className="list-disc list-inside text-xs font-bold space-y-1 text-rose-800">
                {matchResult.eligibility.warnings?.map((warn: string, wIdx: number) => (
                  <li key={wIdx}>{warn}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Level 2 Executive Score Card & 10-Dimension Breakdown */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Overall Score Gauge Card */}
            <div className="human-card p-6 flex flex-col items-center justify-center text-center bg-white border-slate-200 shadow-md">
              <ScoreGauge
                score={matchResult.overall_match_percentage}
                label="Overall Job Match"
                sublabel={matchResult.qualitative_rating || 'STRONG MATCH'}
                type="match"
              />
              <span className="mt-3 px-3 py-1 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-black rounded-full uppercase tracking-wider">
                {matchResult.qualitative_rating || 'STRONG MATCH'}
              </span>
              <p className="text-xs text-slate-500 mt-3 font-medium leading-relaxed">
                Calculated across 10 weighted dimensions combining rule-based taxonomy normalization and NLP cosine recall.
              </p>
            </div>

            {/* 10-Dimension Breakdown Grid */}
            <div className="lg:col-span-2 human-card p-6 space-y-4 bg-white shadow-md">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-emerald-600" /> 10-Factor Compatibility Breakdown
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {[
                  { label: "Skills Match (25%)", score: matchResult.breakdown?.skills, icon: Briefcase },
                  { label: "Experience Duration & Relevance (15%)", score: matchResult.breakdown?.experience, icon: Clock },
                  { label: "Education Match (10%)", score: matchResult.breakdown?.education, icon: GraduationCap },
                  { label: "Keyword Recall (10%)", score: matchResult.breakdown?.keyword_recall, icon: FileText },
                  { label: "Role Overlap (10%)", score: matchResult.breakdown?.role_overlap, icon: GitCompare },
                  { label: "Location Compatibility (5%)", score: matchResult.breakdown?.location, icon: MapPin },
                  { label: "Compensation Match (5%)", score: matchResult.breakdown?.compensation, icon: DollarSign },
                  { label: "Projects & Achievements (5%)", score: matchResult.breakdown?.projects, icon: Sparkles },
                  { label: "Profile Completeness (5%)", score: matchResult.breakdown?.profile_completeness, icon: CheckSquare },
                  { label: "Professional Activity (5%)", score: matchResult.breakdown?.activity, icon: Clock },
                ].map((item, idx) => {
                  const ItemIcon = item.icon;
                  const val = item.score !== undefined ? item.score : 80;
                  return (
                    <div key={idx} className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-slate-700">
                        <span className="flex items-center gap-1.5 truncate">
                          <ItemIcon className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </span>
                        <span className="font-extrabold text-slate-900">{val}%</span>
                      </div>
                      <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all rounded-full ${
                            val >= 85 ? 'bg-emerald-600' : val >= 65 ? 'bg-blue-600' : val >= 50 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${val}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Skill Gap Breakdown with Normalized Taxonomy */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            
            {/* Matched Skills */}
            <div className="human-card p-5 space-y-3 bg-white border-l-4 border-l-emerald-600">
              <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-700 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Matched Skills ({matchResult.skill_match?.matching_skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.skill_match?.matching_skills?.length > 0 ? (
                  matchResult.skill_match.matching_skills.map((s: string, idx: number) => (
                    <span key={idx} className="text-xs bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-1 rounded-lg font-bold">
                      ✓ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-medium">No matching skills detected.</span>
                )}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="human-card p-5 space-y-3 bg-white border-l-4 border-l-rose-600">
              <h4 className="font-bold text-xs uppercase tracking-wider text-rose-700 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <XCircle className="w-4 h-4 text-rose-600" /> Missing Skills ({matchResult.skill_match?.missing_skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.skill_match?.missing_skills?.length > 0 ? (
                  matchResult.skill_match.missing_skills.map((s: string, idx: number) => (
                    <span key={idx} className="text-xs bg-rose-100 text-rose-800 border border-rose-300 px-2.5 py-1 rounded-lg font-bold">
                      ✗ {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-emerald-700 font-bold">✓ 100% Skill Coverage Achieved!</span>
                )}
              </div>
            </div>

            {/* Bonus Additional Skills */}
            <div className="human-card p-5 space-y-3 bg-white border-l-4 border-l-slate-800">
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800 flex items-center gap-1.5 border-b border-slate-200 pb-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Extra Candidate Skills ({matchResult.skill_match?.additional_skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {matchResult.skill_match?.additional_skills?.length > 0 ? (
                  matchResult.skill_match.additional_skills.slice(0, 8).map((s: string, idx: number) => (
                    <span key={idx} className="text-xs bg-slate-100 text-slate-700 border border-slate-300 px-2.5 py-1 rounded-lg font-bold">
                      + {s}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-slate-400 font-medium">None</span>
                )}
              </div>
            </div>
          </div>

          {/* Module Grid: Experience, Education, Location, Compensation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            <div className="human-card p-4 bg-white space-y-2 border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Required Experience</span>
              <p className="text-sm font-black text-slate-900">{matchResult.experience_match?.required_years}</p>
              <div className="text-xs font-semibold text-slate-600">
                Detected: <span className="text-emerald-700 font-extrabold">{matchResult.experience_match?.candidate_years}</span>
              </div>
            </div>

            <div className="human-card p-4 bg-white space-y-2 border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Education Match</span>
              <p className="text-sm font-black text-slate-900">{matchResult.education_match?.match_score}%</p>
              <p className="text-xs text-slate-600 font-medium truncate">{matchResult.education_match?.status}</p>
            </div>

            <div className="human-card p-4 bg-white space-y-2 border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Location Status</span>
              <p className="text-sm font-black text-slate-900">{matchResult.location_match?.match_score}% Match</p>
              <p className="text-xs text-slate-600 font-medium truncate">{matchResult.location_match?.status}</p>
            </div>

            <div className="human-card p-4 bg-white space-y-2 border-slate-200">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compensation Compatibility</span>
              <p className="text-sm font-black text-slate-900">{matchResult.compensation_match?.match_score}%</p>
              <p className="text-xs text-slate-600 font-medium truncate">{matchResult.compensation_match?.status}</p>
            </div>
          </div>

          {/* Strengths, Gaps & Actionable Recommendations */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Strengths & Gaps */}
            <div className="space-y-4">
              <div className="human-card p-5 space-y-3 bg-emerald-50/50 border border-emerald-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-emerald-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Key Profile Strengths
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  {matchResult.strengths?.map((str: string, sIdx: number) => (
                    <li key={sIdx} className="flex items-start gap-2">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="human-card p-5 space-y-3 bg-amber-50/50 border border-amber-200">
                <h4 className="font-bold text-xs uppercase tracking-wider text-amber-800 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-amber-600" /> Detected Gaps & Warnings
                </h4>
                <ul className="space-y-2 text-xs font-semibold text-slate-700">
                  {matchResult.gaps?.map((gap: string, gIdx: number) => (
                    <li key={gIdx} className="flex items-start gap-2">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Gap-Based Recommendations Card */}
            <div className="human-card p-6 space-y-4 bg-white border-slate-200 shadow-md">
              <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-amber-500" /> Actionable Gap-Based Recommendations
              </h4>

              <div className="space-y-3">
                {matchResult.recommendations?.map((rec: string, rIdx: number) => (
                  <div key={rIdx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center justify-center shrink-0 mt-0.5">
                      {rIdx + 1}
                    </span>
                    <p className="text-xs text-slate-800 font-semibold leading-relaxed pt-0.5">
                      {rec}
                    </p>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}
    </div>
  );
};
