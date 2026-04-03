import DashboardLayout from '../../components/layout/DashboardLayout';
import { Link } from 'react-router-dom';
import { ArrowRight, Bot, Upload, Wand2, PieChart, Download } from 'lucide-react';

export default function DashboardHome() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] mb-6">Overview</h1>

        <div className="dc-card p-6 sm:p-7 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="min-w-0">
              <div className="text-sm text-[color:var(--muted)]">Quick start</div>
              <div className="text-xl sm:text-2xl font-semibold tracking-tight text-[color:var(--text)]">
                Upload a dataset, then let the AI help clean it.
              </div>
              <div className="mt-2 text-sm text-[color:var(--muted)]">
                Most workflows follow: Upload → Clean → Insights/Chat → Download.
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/upload" className="dc-btn-primary px-5 py-3">
                <Upload className="w-4 h-4 mr-2" />
                Upload dataset
              </Link>
              <Link to="/chat" className="dc-btn-secondary px-5 py-3">
                <Bot className="w-4 h-4 mr-2" />
                Ask AI
              </Link>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Mock Stats */}
          <div className="dc-card p-6">
            <h3 className="text-sm font-medium text-[color:var(--muted)]">Total Datasets</h3>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--text)]">0</p>
          </div>
          <div className="dc-card p-6">
            <h3 className="text-sm font-medium text-[color:var(--muted)]">Cleaning Operations</h3>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--text)]">0</p>
          </div>
          <div className="dc-card p-6">
            <h3 className="text-sm font-medium text-[color:var(--muted)]">AI Queries</h3>
            <p className="mt-2 text-3xl font-semibold text-[color:var(--text)]">0</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="dc-card p-6">
            <h2 className="text-xl font-semibold text-[color:var(--text)] mb-4">What you can do next</h2>
            <div className="space-y-3 text-sm">
              <Link to="/upload" className="dc-btn-secondary w-full justify-between px-4 py-3">
                <span className="flex items-center">
                  <Upload className="w-4 h-4 mr-2 text-[color:var(--muted-2)]" />
                  Upload a dataset (CSV/XLSX)
                </span>
                <ArrowRight className="w-4 h-4 text-[color:var(--muted-2)]" />
              </Link>
              <Link to="/clean" className="dc-btn-secondary w-full justify-between px-4 py-3">
                <span className="flex items-center">
                  <Wand2 className="w-4 h-4 mr-2 text-[color:var(--muted-2)]" />
                  Run manual cleaning operations
                </span>
                <ArrowRight className="w-4 h-4 text-[color:var(--muted-2)]" />
              </Link>
              <Link to="/insights" className="dc-btn-secondary w-full justify-between px-4 py-3">
                <span className="flex items-center">
                  <PieChart className="w-4 h-4 mr-2 text-[color:var(--muted-2)]" />
                  Generate AI insights summary
                </span>
                <ArrowRight className="w-4 h-4 text-[color:var(--muted-2)]" />
              </Link>
              <Link to="/download" className="dc-btn-secondary w-full justify-between px-4 py-3">
                <span className="flex items-center">
                  <Download className="w-4 h-4 mr-2 text-[color:var(--muted-2)]" />
                  Download cleaned data
                </span>
                <ArrowRight className="w-4 h-4 text-[color:var(--muted-2)]" />
              </Link>
            </div>
          </div>

          <div className="dc-card p-6">
            <h2 className="text-xl font-semibold text-[color:var(--text)] mb-4">Recent Activity</h2>
            <div className="text-[color:var(--muted)] text-center py-10">
              No recent activity yet. Start by uploading a dataset.
            </div>
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
}
