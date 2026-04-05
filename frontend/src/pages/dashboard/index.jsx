import { useEffect, useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Link, useLocation } from 'react-router-dom';
import { ArrowRight, Bot, Download, PieChart, Sparkles, Upload, Wand2 } from 'lucide-react';
import api from '../../api/axios';

const nextSteps = [
  { to: '/upload', icon: Upload, title: 'Upload a dataset', copy: 'Start with a CSV or Excel file and generate a quick profile.' },
  { to: '/clean', icon: Wand2, title: 'Clean manually', copy: 'Run fast fixes for duplicates, missing values, and outliers.' },
  { to: '/insights', icon: PieChart, title: 'Generate insights', copy: 'Turn basic stats into a readable summary before exporting.' },
  { to: '/download', icon: Download, title: 'Export clean data', copy: 'Download the final dataset in the format you need.' },
];

export default function DashboardHome() {
  const location = useLocation();
  const [datasets, setDatasets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    async function loadDatasets() {
      try {
        setLoading(true);
        const response = await api.get('/datasets/');
        if (!ignore) {
          setDatasets(response.data);
          setError('');
        }
      } catch (err) {
        if (!ignore) {
          setError(err.response?.data?.detail || 'Unable to load datasets.');
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDatasets();
    return () => {
      ignore = true;
    };
  }, [location.state?.uploadedDatasetId]);

  const metrics = [
    {
      label: 'Datasets tracked',
      value: String(datasets.length),
      note: datasets.length ? 'Available in your workspace' : 'Ready for your first upload',
    },
    { label: 'Cleaning actions', value: '0', note: 'Manual and AI changes' },
    { label: 'Insight requests', value: '0', note: 'Summaries and charts' },
  ];

  return (
    <DashboardLayout>
      <div className="dc-page">
        <section className="dc-card overflow-hidden px-6 py-6 sm:px-8 sm:py-8">
          <div className="grid gap-8 xl:grid-cols-[minmax(0,1.2fr)_22rem]">
            <div>
              <div className="dc-badge">
                <Sparkles className="h-4 w-4" />
                End-to-end data cleaning workspace
              </div>
              <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-[-0.05em] text-[color:var(--text)] sm:text-5xl">
                Clean datasets faster and keep the workflow readable on any screen.
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[color:var(--muted)] sm:text-base">
                Upload a file, apply manual fixes or AI guidance, review summaries, and export the cleaned result from one responsive workspace.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/upload" className="dc-btn-primary">
                  <Upload className="mr-2 h-4 w-4" />
                Upload dataset
              </Link>
              <Link to="/chat" className="dc-btn-secondary">
                <Bot className="mr-2 h-4 w-4" />
                Ask AI
              </Link>
            </div>
          </div>
            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
              {metrics.map((metric) => (
                <div key={metric.label} className="rounded-[1.4rem] border px-5 py-5" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <div className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--muted-2)]">{metric.label}</div>
                  <div className="mt-3 text-4xl font-bold tracking-[-0.05em]">{metric.value}</div>
                  <div className="mt-2 text-sm text-[color:var(--muted)]">{metric.note}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <div className="dc-card p-6 sm:p-7">
            <div className="dc-page-header">
              <div>
                <div className="dc-page-kicker">Workflow</div>
                <h2 className="text-2xl font-bold tracking-[-0.04em]">What you can do next</h2>
              </div>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {nextSteps.map((step) => (
                <Link key={step.to} to={step.to} className="group rounded-[1.4rem] border p-5 transition-all hover:-translate-y-0.5" style={{ borderColor: 'var(--border)', backgroundColor: 'rgba(255,255,255,0.03)' }}>
                  <div className="flex items-center justify-between">
                    <div className="grid h-12 w-12 place-items-center rounded-2xl border" style={{ borderColor: 'rgba(56, 189, 248, 0.22)', backgroundColor: 'rgba(15, 157, 138, 0.12)' }}>
                      <step.icon className="h-5 w-5 text-[color:var(--primary-2)]" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-[color:var(--muted-2)] transition-transform group-hover:translate-x-1" />
                  </div>
                  <div className="mt-4 text-lg font-semibold tracking-tight">{step.title}</div>
                  <div className="mt-2 text-sm leading-6 text-[color:var(--muted)]">{step.copy}</div>
                </Link>
              ))}
            </div>
          </div>

          <div className="dc-card p-6 sm:p-7">
            <div className="dc-page-header">
              <div>
                <div className="dc-page-kicker">Activity</div>
                <h2 className="text-2xl font-bold tracking-[-0.04em]">Recent workspace status</h2>
              </div>
            </div>
            {loading ? (
              <div className="mt-6 rounded-[1.4rem] border border-dashed px-6 py-14 text-center" style={{ borderColor: 'rgba(148, 163, 184, 0.24)' }}>
                <div className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted-2)]">Loading datasets</div>
              </div>
            ) : error ? (
              <div className="mt-6 rounded-[1.4rem] border px-6 py-6 text-sm" style={{ borderColor: 'rgba(239, 68, 68, 0.24)', color: 'rgba(254, 226, 226, 0.95)' }}>
                {error}
              </div>
            ) : datasets.length === 0 ? (
              <div className="mt-6 rounded-[1.4rem] border border-dashed px-6 py-14 text-center" style={{ borderColor: 'rgba(148, 163, 184, 0.24)' }}>
                <div className="text-sm uppercase tracking-[0.18em] text-[color:var(--muted-2)]">No recent activity</div>
                <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-[color:var(--muted)]">
                  Start by uploading a dataset. Once you run cleaning or insight actions, this area becomes a quick project pulse.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-5">
                {datasets.map((dataset) => (
                  <div
                    key={dataset.dataset_id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 last:border-0 last:pb-0"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="min-w-0">
                      <div className="text-base font-semibold truncate text-[color:var(--text)]">{dataset.file_name}</div>
                      <div className="mt-[2px] text-sm text-[color:var(--muted)] truncate">
                        ID: {dataset.dataset_id} &bull; {dataset.rows} rows &bull; {dataset.columns} cols
                      </div>
                    </div>
                    <Link to="/clean" className="dc-btn-secondary text-sm px-4 py-2 shrink-0 whitespace-nowrap">
                      Open in cleaning
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}
