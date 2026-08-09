import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileSearch,
  ShieldAlert,
  GitCompare,
  Lightbulb,
  Users,
  Activity,
  Upload,
  Wand2,
  Shield,
  X
} from 'lucide-react';

interface SidebarProps {
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, onCloseMobile }) => {
  const { user } = useAuth();

  const userNavItems = [
    { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
    { path: '/resume-builder', label: 'ATS Resume Builder', icon: Wand2 },
    { path: '/resume-upload', label: 'Upload & Parse', icon: Upload },
    { path: '/resume-analysis', label: '12-Aspect ATS Audit', icon: FileSearch },
    { path: '/fake-job-detector', label: 'Fake Job Detector', icon: ShieldAlert },
    { path: '/job-matcher', label: 'Job Matcher (JD)', icon: GitCompare },
    { path: '/recommendations', label: 'Recommendations', icon: Lightbulb },
  ];

  const adminNavItems = [
    { path: '/admin-dashboard', label: 'Super Admin Analytics', icon: Activity },
    { path: '/user-management', label: 'User Directory & RBAC', icon: Users },
  ];

  return (
    <>
      {/* Mobile Drawer Overlay Backdrop */}
      {mobileOpen && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-30 md:hidden"
        />
      )}

      <aside
        className={`w-64 border-r border-slate-200 bg-white flex flex-col justify-between py-6 px-3 shrink-0 transition-all duration-300 z-40
          md:sticky md:top-16 md:h-[calc(100vh-4rem)] md:overflow-y-auto md:block
          ${mobileOpen ? 'fixed left-0 top-16 h-[calc(100vh-4rem)] overflow-y-auto block shadow-2xl' : 'hidden md:block'}
        `}
      >
        <div className="space-y-6">
          {/* Mobile Header Close Button */}
          <div className="flex items-center justify-between px-3 md:hidden border-b border-slate-200 pb-3">
            <span className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              Navigation Menu
            </span>
            <button
              onClick={onCloseMobile}
              className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
              Main Workspace
            </p>
            <nav className="space-y-1">
              {userNavItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={onCloseMobile}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${isActive
                        ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                      }`
                    }
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          {user?.role === 'super_admin' && (
            <div className="pt-4 border-t border-rose-100">
              <p className="px-3 text-[10px] font-extrabold text-rose-700 uppercase tracking-widest mb-3 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-rose-600" /> Super Admin Controls
                </span>
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
              </p>
              <nav className="space-y-1">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-bold transition-all ${isActive
                          ? 'bg-rose-950 text-rose-300 border border-rose-800/80 shadow-md'
                          : 'text-rose-900 hover:text-rose-950 hover:bg-rose-50'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{item.label}</span>
                    </NavLink>
                  );
                })}
              </nav>
            </div>
          )}
        </div>
      </aside>
    </>
  );
};
