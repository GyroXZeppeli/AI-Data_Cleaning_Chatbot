import { Link, useLocation } from 'react-router-dom';
import { Database, Upload, Wand2, MessageSquare, PieChart, Download, Clock, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/authContext';
import clsx from 'clsx';

const navigation = [
  { name: 'Dashboard', href: '/', icon: Database },
  { name: 'Upload Dataset', href: '/upload', icon: Upload },
  { name: 'Manual Cleaning', href: '/clean', icon: Wand2 },
  { name: 'AI Chatbot', href: '/chat', icon: MessageSquare },
  { name: 'Insights', href: '/insights', icon: PieChart },
  { name: 'Extract Data', href: '/download', icon: Download },
  { name: 'History', href: '/history', icon: Clock },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const location = useLocation();
  const { logout } = useAuth();

  const handleLogout = () => {
    onClose?.();
    logout();
  };

  const sidebarContent = (
    <div
      className="flex h-full flex-col rounded-[1.75rem] border backdrop-blur"
      style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(8, 18, 34, 0.82)' }}
    >
      <div className="flex items-center gap-3 border-b px-5 py-5" style={{ borderColor: 'var(--border)' }}>
        <div
          className="grid h-11 w-11 place-items-center rounded-2xl"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-2))' }}
        >
          <Database className="h-5 w-5 text-white" />
        </div>
        <div className="min-w-0">
          <div className="truncate text-base font-semibold tracking-tight text-[color:var(--text)]">DataClean AI</div>
          <div className="truncate text-xs uppercase tracking-[0.22em] text-[color:var(--muted-2)]">Dataset workspace</div>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto inline-flex h-10 w-10 items-center justify-center rounded-2xl border bg-white/5 lg:hidden"
          style={{ borderColor: 'var(--border)' }}
          aria-label="Close navigation"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="px-5 pt-5">
        <div className="dc-card px-4 py-4">
          <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-2)]">Workflow</div>
          <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">
            Upload, clean, inspect, and export datasets without switching tools.
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5">
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={onClose}
                className={clsx(
                  'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-all',
                  isActive
                    ? 'text-white shadow-lg'
                    : 'text-[color:var(--muted)] hover:text-[color:var(--text)]'
                )}
                style={
                  isActive
                    ? {
                        background:
                          'linear-gradient(135deg, rgba(15, 157, 138, 0.28), rgba(56, 189, 248, 0.26))',
                        border: '1px solid rgba(56, 189, 248, 0.28)',
                      }
                    : {
                        backgroundColor: 'rgba(255,255,255,0.025)',
                        border: '1px solid transparent',
                      }
                }
              >
                <item.icon
                  className={clsx(
                    'h-5 w-5 flex-shrink-0',
                    isActive ? 'text-white' : 'text-[color:var(--muted-2)] group-hover:text-[color:var(--text)]'
                  )}
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium transition-colors text-[color:var(--muted)] hover:text-[color:var(--text)]"
          style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.025)' }}
        >
          <LogOut className="h-5 w-5 flex-shrink-0 text-[color:var(--muted-2)]" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="sticky top-0 hidden h-dvh pt-6 lg:block">
        {sidebarContent}
      </aside>

      <div className={clsx('fixed inset-0 z-40 lg:hidden', mobileOpen ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div
          className={clsx('absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity', mobileOpen ? 'opacity-100' : 'opacity-0')}
          onClick={onClose}
        />
        <aside
          className={clsx(
            'absolute inset-y-0 left-0 w-[min(88vw,22rem)] p-4 transition-transform duration-200',
            mobileOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          {sidebarContent}
        </aside>
      </div>
    </>
  );
}
