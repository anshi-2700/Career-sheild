import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Shield, LogOut, Download, ShieldAlert, AlertCircle, Menu } from 'lucide-react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';

interface NavbarProps {
  onToggleMobileMenu?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleMobileMenu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [reportError, setReportError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleDownloadReport = async (type: string) => {
    setReportError('');
    try {
      const response = await api.get(`/reports/download/${type}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${type}_report.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setReportError("Report generation requires an active resume or job scan. Please run analysis first.");
      setTimeout(() => setReportError(''), 4000);
    }
  };

  return (
    <header className="h-16 border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 px-3 sm:px-6 flex items-center justify-between">
      {/* Left: Mobile Hamburger Toggle + Brand Identity */}
      <div className="flex items-center gap-2.5">
        {user && (
          <button
            onClick={onToggleMobileMenu}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 md:hidden border border-slate-200 transition-all shrink-0"
            title="Toggle Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="CareerShield Logo" className="w-8 h-8 sm:w-9 sm:h-9 object-contain shrink-0 drop-shadow-sm" />
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight leading-none">
              Career<span className="text-emerald-600">Shield</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-medium hidden md:block mt-0.5">
              Career Safety & Resume Optimization Engine
            </p>
          </div>
        </div>
      </div>

      {/* App Error Toast Banner */}
      {reportError && (
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 bg-rose-50 border border-rose-200 text-rose-800 text-xs font-bold rounded-xl animate-fade-in">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span className="truncate">{reportError}</span>
        </div>
      )}

      {/* Right: Action Buttons & Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {user && (
          <div className="hidden lg:flex items-center gap-2 mr-1">
            <button
              onClick={() => handleDownloadReport('resume')}
              className="text-xs bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" /> Resume Report
            </button>
            <button
              onClick={() => handleDownloadReport('fake-job')}
              className="text-xs bg-white hover:bg-slate-50 border border-slate-300 text-slate-800 px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 shadow-sm shrink-0"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-rose-600" /> Job Risk Report
            </button>
          </div>
        )}

        {user && (
          <div className="flex items-center gap-2 sm:gap-3 pl-2 sm:pl-3 border-l border-slate-200">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-100 border border-emerald-300 flex items-center justify-center text-emerald-800 font-bold text-xs shrink-0">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col text-left hidden sm:block max-w-[120px] truncate">
              <span className="text-xs font-bold text-slate-900 leading-tight truncate">{user.full_name}</span>
              <span className="text-[10px] text-slate-500 capitalize font-semibold truncate">
                {user.role === 'super_admin' ? (
                  <span className="text-rose-600 font-bold uppercase">Super Admin</span>
                ) : (
                  'Job Seeker'
                )}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-600 border border-slate-200 transition-all shrink-0"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
