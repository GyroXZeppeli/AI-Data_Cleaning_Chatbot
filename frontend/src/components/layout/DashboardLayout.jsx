import Sidebar from './Sidebar';

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-dvh text-[color:var(--text)]">
      <div className="mx-auto max-w-[1400px] grid grid-cols-1 lg:grid-cols-[18rem_1fr]">
        <Sidebar />
        <div className="min-w-0">
          <main className="p-5 sm:p-8 lg:p-10">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
