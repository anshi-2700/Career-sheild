import React, { useState } from 'react';
import { api, getErrorMessage } from '../services/api';
import { ScoreGauge } from '../components/ScoreGauge';
import {
  ShieldAlert, CheckCircle2, AlertTriangle, Globe, Mail, Download,
  ArrowRight, Search, Upload, Image as ImageIcon, FileText, Check
} from 'lucide-react';

export const FakeJobDetector: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upload' | 'text'>('upload');
  
  // File Upload State
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Manual Form State
  const [jobDescription, setJobDescription] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [offeredSalary, setOfferedSalary] = useState<number | ''>('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (!['png', 'jpg', 'jpeg', 'webp', 'pdf'].includes(ext || '')) {
        setError('Only Image (PNG, JPG, WEBP) and PDF file formats are supported.');
        setSelectedFile(null);
        setPreviewUrl(null);
        return;
      }
      setError('');
      setSelectedFile(file);

      if (['png', 'jpg', 'jpeg', 'webp'].includes(ext || '')) {
        setPreviewUrl(URL.createObjectURL(file));
      } else {
        setPreviewUrl(null);
      }
    }
  };

  const handleAnalyzeText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobDescription.trim()) {
      setError('Please enter or paste a job posting description.');
      return;
    }
    setError('');
    setLoading(true);

    try {
      const res = await api.post('/fake-job/analyze', {
        job_description: jobDescription,
        company_name: companyName || 'Unknown Company',
        company_website: companyWebsite,
        contact_email: contactEmail,
        offered_salary: Number(offeredSalary) || 0
      });
      setAnalysisResult(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Fake job detection failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyzeImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a job screenshot image (PNG/JPG) or PDF document.');
      return;
    }
    setError('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('company_name', companyName);
    formData.append('company_website', companyWebsite);
    formData.append('contact_email', contactEmail);
    formData.append('offered_salary', String(offeredSalary || 0));

    try {
      const res = await api.post('/fake-job/upload-image', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setAnalysisResult(res.data);
    } catch (err: any) {
      setError(getErrorMessage(err, 'OCR image extraction & fraud analysis failed.'));
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      const response = await api.get('/reports/download/fake-job', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Fake_Job_Risk_Audit.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError('Could not download PDF risk report. Please analyze a job posting first.');
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-rose-600" /> Fake Job & Scam Detector
        </h2>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Upload job screenshots (WhatsApp/Telegram/Offer Letters) or paste text to evaluate ML fraud risks & scam indicators.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 font-semibold">
          <AlertTriangle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {/* Input Mode Selector Tabs */}
      <div className="flex border-b border-slate-200 gap-4">
        <button
          type="button"
          onClick={() => setActiveTab('upload')}
          className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'upload'
              ? 'border-rose-600 text-rose-700 bg-rose-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <ImageIcon className="w-4 h-4" /> Upload Job Screenshot / Document (OCR)
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`py-3 px-4 text-xs font-bold transition-all border-b-2 flex items-center gap-2 ${
            activeTab === 'text'
              ? 'border-rose-600 text-rose-700 bg-rose-50/50 rounded-t-xl'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" /> Enter Job Posting Text
        </button>
      </div>

      {/* Form Container */}
      <div className="human-card p-6 space-y-6">
        {/* Optional Verification Fields */}
        <div className="space-y-4">
          <h3 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-2 flex items-center gap-2">
            <Search className="w-4 h-4 text-emerald-600" /> Verification Details (Optional)
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="e.g. St. Jude Clinical Healthcare"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Company Website URL</label>
              <input
                type="url"
                value={companyWebsite}
                onChange={(e) => setCompanyWebsite(e.target.value)}
                placeholder="https://company.org"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                placeholder="hr@company.org"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-600"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 uppercase mb-1">Offered Salary ($ USD)</label>
              <input
                type="number"
                value={offeredSalary}
                onChange={(e) => setOfferedSalary(e.target.value ? Number(e.target.value) : '')}
                placeholder="e.g. 120000"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-medium focus:outline-none focus:border-rose-600"
              />
            </div>
          </div>
        </div>

        {/* TAB 1: SCREENSHOT UPLOAD */}
        {activeTab === 'upload' && (
          <form onSubmit={handleAnalyzeImage} className="space-y-4">
            <div className="border-2 border-dashed border-slate-200 hover:border-rose-500 rounded-2xl p-8 text-center transition-all bg-slate-50">
              <Upload className="w-10 h-10 text-rose-600 mx-auto mb-2" />
              <h4 className="font-extrabold text-sm text-slate-900">Upload Job Posting Screenshot / Offer Letter</h4>
              <p className="text-xs text-slate-500 mt-1 mb-4 font-medium">Supported formats: PNG, JPG, WEBP, PDF • Max size: 15MB</p>

              <input
                type="file"
                id="screenshot-input"
                accept=".png,.jpg,.jpeg,.webp,.pdf"
                onChange={handleFileChange}
                className="hidden"
              />
              <label
                htmlFor="screenshot-input"
                className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl cursor-pointer shadow-sm inline-block"
              >
                Browse Image / Screenshot
              </label>

              {selectedFile && (
                <div className="mt-4 p-3 bg-rose-50 rounded-xl border border-rose-200 max-w-md mx-auto flex items-center justify-center gap-2">
                  <Check className="w-4 h-4 text-rose-600 font-bold" />
                  <span className="text-xs font-bold text-rose-900">{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}

              {previewUrl && (
                <div className="mt-4 max-w-xs mx-auto overflow-hidden rounded-xl border border-slate-300 shadow-sm">
                  <img src={previewUrl} alt="Job Screenshot Preview" className="max-h-48 w-full object-cover" />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !selectedFile}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? 'Executing OCR Text Extraction & ML Scam Audit...' : 'Scan Screenshot & Run Fraud Audit'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {/* TAB 2: MANUAL TEXT INPUT */}
        {activeTab === 'text' && (
          <form onSubmit={handleAnalyzeText} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">Job Description / Posting Text</label>
              <textarea
                rows={6}
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                placeholder="Paste full job posting text or chat message here..."
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-xs font-mono focus:outline-none focus:border-rose-600"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !jobDescription.trim()}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
            >
              {loading ? 'Evaluating ML Model & Scam Rule Matrix...' : 'Run Fake Job Risk Audit'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}
      </div>

      {/* Analysis Output Result */}
      {analysisResult && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-6 h-6 text-rose-600" /> Audit Results for {analysisResult.company_verification?.company_name || analysisResult.company_name}
            </h3>
            <button
              onClick={handleDownloadPDF}
              className="px-4 py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4 text-rose-600" /> Download PDF Audit Report
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Risk Gauge */}
            <div className="human-card p-6 flex flex-col items-center justify-center text-center">
              <ScoreGauge
                score={analysisResult.risk_score}
                label="Risk Score"
                sublabel={analysisResult.prediction}
                type="risk"
              />
              <p className="text-xs text-slate-500 mt-2 font-medium">
                ML Confidence Rating: <span className="font-bold text-slate-900">{analysisResult.confidence}%</span>
              </p>
            </div>

            {/* Flagged Scam Reasons */}
            <div className="md:col-span-2 human-card p-6 space-y-3">
              <h4 className="font-bold text-xs text-slate-800 border-b border-slate-200 pb-2 uppercase tracking-wider flex items-center justify-between">
                <span>Flagged Indicators ({analysisResult.flagged_reasons?.length || 0})</span>
                <span className={`text-xs px-2.5 py-0.5 rounded font-bold ${analysisResult.prediction === 'Fake' ? 'human-badge-rose' : 'human-badge-emerald'}`}>
                  {analysisResult.prediction} Job
                </span>
              </h4>
              <div className="space-y-2">
                {analysisResult.flagged_reasons?.map((reason: string, idx: number) => (
                  <div key={idx} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs flex items-start gap-2.5">
                    {analysisResult.prediction === 'Fake' ? (
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    )}
                    <span className="text-slate-800 font-semibold">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Company & Domain Verification Audit */}
          <div className="human-card p-6 space-y-4">
            <h4 className="font-bold text-xs text-slate-800 border-b border-slate-200 pb-2 uppercase tracking-wider">
              Company & Domain Security Audit
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block mb-1 font-medium">Company Website</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5 text-emerald-600" />
                  {analysisResult.company_verification?.has_website ? 'Website Provided' : 'Missing URL'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block mb-1 font-medium">HTTPS Encryption</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
                  {analysisResult.company_verification?.is_https ? 'Secure (HTTPS)' : 'Unencrypted / None'}
                </span>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                <span className="text-slate-500 block mb-1 font-medium">Email Domain Match</span>
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" />
                  {analysisResult.company_verification?.email_domain_match ? 'Domain Matched' : 'Domain Mismatch'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
