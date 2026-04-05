import { useState } from 'react';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="dc-shell">
      <div className="dc-shell-inner lg:grid lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-6">
        <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

        <div className="min-w-0">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b px-1 py-4 backdrop-blur lg:hidden" style={{ borderColor: 'var(--border)' }}>
            <div>
              <div className="text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--muted-2)]">Workspace</div>
              <div className="text-lg font-semibold tracking-tight">DataClean AI</div>
            </div>
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border bg-white/5"
              style={{ borderColor: 'var(--border)' }}
              aria-label="Open navigation"
            >
              <Menu className="h-5 w-5" />
            </button>
          </header>

          <main className="px-1 pb-6 pt-4 sm:pt-6 lg:px-0 lg:py-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
