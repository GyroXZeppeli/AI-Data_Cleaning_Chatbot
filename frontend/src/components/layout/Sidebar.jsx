import { Link, useLocation } from 'react-router-dom';
import { Database, Upload, Wand2, MessageSquare, PieChart, Download, Clock, LogOut } from 'lucide-react';
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

export default function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  return (
    <div
      className="hidden lg:flex flex-col w-[18rem] h-dvh sticky top-0 border-r backdrop-blur"
      style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(18, 19, 26, 0.92)' }}
    >
      <div className="flex items-center gap-2 h-16 px-4 border-b" style={{ borderColor: 'var(--border)' }}>
        <div
          className="h-9 w-9 rounded-xl grid place-items-center"
          style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-2))' }}
        >
          <Database className="h-5 w-5 text-white" />
        </div>
        <div className="leading-tight">
          <div className="text-[color:var(--text)] font-semibold tracking-tight">DataClean AI</div>
          <div className="text-xs text-[color:var(--muted-2)]">AI data cleaning</div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <nav className="px-3 space-y-1">
          {navigation.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={clsx(
                  isActive
                    ? 'text-white'
                    : 'text-[color:var(--muted)] hover:text-[color:var(--text)]',
                  'group flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors'
                )}
                style={
                  isActive
                    ? {
                        background:
                          'linear-gradient(135deg, rgba(155, 81, 224, 0.22), rgba(192, 132, 252, 0.12))',
                        border: '1px solid rgba(155, 81, 224, 0.28)',
                      }
                    : undefined
                }
              >
                <item.icon
                  className={clsx(
                    isActive ? 'text-white' : 'text-[color:var(--muted-2)] group-hover:text-[color:var(--text)]',
                    'flex-shrink-0 h-5 w-5'
                  )}
                  aria-hidden="true"
                />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="border-t p-4" style={{ borderColor: 'var(--border)' }}>
        <button
          onClick={logout}
          className="flex w-full items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-xl transition-colors text-[color:var(--muted)] hover:text-[color:var(--text)]"
          style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}
        >
          <LogOut className="flex-shrink-0 h-5 w-5 text-[color:var(--muted-2)]" />
          Logout
        </button>
      </div>
    </div>
  );
}
