import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { PieChart, Loader2 } from 'lucide-react';
import api from '../../api/axios';

// Note: Plotly requires external scripts to render JSON configs strictly in React
// For full functionality, we'd use `react-plotly.js`, but we'll mock the render space here
// and display the textual insights fully.

export default function InsightsPage() {
  const [datasetId, setDatasetId] = useState('');
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchInsights = async () => {
      if (!datasetId) return;
      setLoading(true);
      setError('');
      setInsights(null);

      try {
          // Fetch textual summary
          const response = await api.get(`/insights/${datasetId}/summary`);
          setInsights(response.data);
      } catch (err) {
          setError(err.response?.data?.detail || "Failed to fetch insights.");
      } finally {
          setLoading(false);
      }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] mb-6 flex items-center">
            <PieChart className="w-8 h-8 mr-3 text-[color:var(--primary-2)]" />
            Data Insights
        </h1>

        <div className="dc-card p-6 flex flex-col md:flex-row md:items-end gap-4">
            <div className="flex-1">
                 <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">Dataset ID</label>
                 <input 
                    type="number"
                    value={datasetId}
                    onChange={(e) => setDatasetId(e.target.value)}
                    placeholder="Enter Dataset ID"
                    className="dc-input"
                 />
            </div>
            <button
                onClick={fetchInsights}
                disabled={loading || !datasetId}
                className="dc-btn-primary px-6 py-3 disabled:opacity-50 flex items-center"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : 'Generate Insights'}
            </button>
        </div>

        {error && (
          <div className="p-4 rounded-xl" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--danger)' }}>
            {error}
          </div>
        )}

        {insights && (
            <div className="space-y-6">
                <div className="dc-card p-6">
                    <h3 className="text-lg font-semibold text-[color:var(--text)] border-b pb-3 mb-4" style={{ borderColor: 'var(--border)' }}>AI Executive Summary</h3>
                    <p className="text-[color:var(--muted)] leading-relaxed text-[15px]">
                        {insights.text_insights}
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="dc-card p-6">
                        <h3 className="text-lg font-semibold text-[color:var(--text)] mb-4">Basic Statistics</h3>
                        <ul className="space-y-3 text-sm">
                            <li className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}><span className="text-[color:var(--muted)]">Total Rows</span><span className="text-[color:var(--text)] font-semibold">{insights.stats.rows}</span></li>
                            <li className="flex justify-between border-b pb-2" style={{ borderColor: 'var(--border)' }}><span className="text-[color:var(--muted)]">Total Columns</span><span className="text-[color:var(--text)] font-semibold">{insights.stats.columns}</span></li>
                        </ul>
                     </div>

                     <div className="dc-card p-6 flex items-center justify-center min-h-[200px]">
                        <div className="text-center text-[color:var(--muted-2)] space-y-2">
                            <PieChart className="w-10 h-10 mx-auto opacity-50" />
                            <p className="text-sm">Advanced Plotly Visualizations would render here.</p>
                            <p className="text-xs">Requires react-plotly.js integration.</p>
                        </div>
                     </div>
                </div>
            </div>
        )}
      </div>
    </DashboardLayout>
  );
}
