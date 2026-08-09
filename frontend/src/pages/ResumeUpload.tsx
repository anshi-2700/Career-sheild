import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api, getErrorMessage } from '../services/api';
import { ConfirmModal } from '../components/ConfirmModal';
import { Upload, FileText, CheckCircle2, AlertCircle, ArrowRight, User, Mail, Phone, Trash2 } from 'lucide-react';

export const ResumeUpload: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [parsedResult, setParsedResult] = useState<any>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchMyResume();
  }, []);

  const fetchMyResume = async () => {
    try {
      const res = await api.get('/resume/my-resume');
      if (res.data) {
        setParsedResult(res.data);
      }
    } catch (err) {
      console.error("Fetch existing resume error:", err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const ext = file.name.split('.').pop()?.toLowerCase();
      if (ext !== 'pdf' && ext !== 'docx') {
        setError('Only PDF and DOCX file formats are supported.');
        setSelectedFile(null);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        setError('File size exceeds maximum 10MB limit.');
        setSelectedFile(null);
        return;
      }
      setError('');
      setSuccessMsg('');
      setSelectedFile(file);
    }
  };

  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a PDF or DOCX file to upload.');
      return;
    }
    setError('');
    setSuccessMsg('');
    setLoading(true);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const res = await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setParsedResult(res.data);
      setSuccessMsg('New resume uploaded & analyzed successfully!');
      setSelectedFile(null);
    } catch (err: any) {
      setError(getErrorMessage(err, 'Resume upload failed. You can re-select your file to try again.'));
    } finally {
      setLoading(false);
    }
  };

  const executeDeleteResume = async () => {
    setShowConfirmModal(false);
    setDeleting(true);
    setError('');
    try {
      await api.delete('/resume/delete');
      setParsedResult(null);
      setSelectedFile(null);
      setSuccessMsg('Previous resume removed cleanly from your workspace. Please select your new up-to-date resume file below.');
    } catch (err: any) {
      // Even if API reports glitch, clear app state so user can upload new file
      setParsedResult(null);
      setSelectedFile(null);
      setSuccessMsg('Ready for new upload. Select your updated resume file below.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* App Confirmation Modal */}
      <ConfirmModal
        isOpen={showConfirmModal}
        title="Delete Current Resume?"
        message="This will remove your currently saved resume record so you can upload your latest up-to-date version. Are you sure you want to proceed?"
        confirmLabel="Yes, Delete & Re-upload"
        cancelLabel="Keep Current Resume"
        isDanger={true}
        onConfirm={executeDeleteResume}
        onCancel={() => setShowConfirmModal(false)}
      />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Upload className="w-7 h-7 text-emerald-600" /> Upload & Parse Resume Document
          </h2>
          <p className="text-slate-500 text-sm mt-1 font-medium">Upload your PDF or DOCX resume for 12-aspect ATS scoring, entity extraction & cloud storage.</p>
        </div>

        {parsedResult && (
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={deleting}
            className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs rounded-xl shadow-sm transition-all flex items-center gap-2 shrink-0 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 text-rose-600" />
            {deleting ? 'Deleting Resume...' : 'Delete Resume & Upload New'}
          </button>
        )}
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 font-semibold">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-600" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 font-semibold">
          <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Existing Active Resume Banner */}
      {parsedResult && (
        <div className="p-4 bg-emerald-50/70 border border-emerald-200 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <p className="font-extrabold text-slate-900">
                Active Resume: {parsedResult.parsed_data?.candidate_name || parsedResult.file_name}
              </p>
              <p className="text-slate-500 text-[11px] font-medium">
                File: {parsedResult.file_name || 'Document.pdf'} • ATS Score: <span className="font-bold text-emerald-800">{parsedResult.ats_score}%</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowConfirmModal(true)}
            disabled={deleting}
            className="text-xs text-rose-700 hover:text-rose-900 font-bold underline flex items-center gap-1 self-start sm:self-auto"
          >
            <Trash2 className="w-3.5 h-3.5" /> Replace / Delete Current Resume
          </button>
        </div>
      )}

      {/* File Upload Form */}
      <form onSubmit={handleFileUpload} className="human-card p-8 text-center">
        <div className="border-2 border-dashed border-slate-200 hover:border-emerald-500 rounded-2xl p-10 transition-all bg-slate-50">
          <Upload className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
          <h3 className="font-bold text-base text-slate-900 mb-1">
            {parsedResult ? 'Upload New Up-To-Date Resume File' : 'Drag and drop your PDF or DOCX file'}
          </h3>
          <p className="text-xs text-slate-500 mb-6 font-medium">Supported formats: .pdf, .docx • Max file size: 10MB</p>
          
          <input
            type="file"
            id="resume-file-input"
            accept=".pdf,.docx"
            onChange={handleFileChange}
            className="hidden"
          />
          <label
            htmlFor="resume-file-input"
            className="px-4 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-bold text-xs rounded-xl cursor-pointer transition-all inline-block border border-slate-300 shadow-sm"
          >
            Browse Local Files
          </label>
          {selectedFile && (
            <p className="mt-4 text-xs font-semibold text-emerald-700 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> {selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={loading || !selectedFile}
          className="mt-6 w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-sm disabled:opacity-50"
        >
          {loading ? 'Processing Multi-Domain NLP Data...' : 'Upload & Process New Resume'}
          <ArrowRight className="w-4 h-4" />
        </button>
      </form>

      {/* Parsed Output */}
      {parsedResult && (
        <div className="space-y-6 pt-6 border-t border-slate-200">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-xl text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" /> Extracted Entities
            </h3>
            <button
              onClick={() => navigate('/resume-analysis')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
            >
              View 12-Aspect ATS Audit <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="human-card p-6 space-y-4">
              <h4 className="font-bold text-xs text-slate-800 border-b border-slate-200 pb-2 uppercase tracking-wider">
                Contact & Document Details
              </h4>
              <div className="space-y-2 text-xs">
                <p className="flex items-center gap-2 text-slate-700">
                  <User className="w-4 h-4 text-emerald-600" /> Name: <span className="font-bold text-slate-900">{parsedResult.parsed_data?.candidate_name}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <Mail className="w-4 h-4 text-emerald-600" /> Email: <span className="font-bold text-slate-900">{parsedResult.parsed_data?.email}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <Phone className="w-4 h-4 text-emerald-600" /> Phone: <span className="font-bold text-slate-900">{parsedResult.parsed_data?.phone}</span>
                </p>
                <p className="flex items-center gap-2 text-slate-700">
                  <FileText className="w-4 h-4 text-emerald-600" /> Word Count: <span className="font-bold text-slate-900">{parsedResult.parsed_data?.word_count} words</span>
                </p>
              </div>
            </div>

            <div className="human-card p-6 space-y-4">
              <h4 className="font-bold text-xs text-slate-800 border-b border-slate-200 pb-2 uppercase tracking-wider">
                Extracted Multi-Domain Skills ({parsedResult.parsed_data?.skills?.length || 0})
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {parsedResult.parsed_data?.skills?.map((skill: string, idx: number) => (
                  <span key={idx} className="text-xs human-badge-emerald font-bold px-2.5 py-1 rounded-lg">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
