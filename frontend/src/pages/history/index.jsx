import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Clock, Database } from 'lucide-react';
import api from '../../api/axios';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/history');
        setHistory(response.data.history || []);
      } catch {
        setError("Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] mb-6 flex items-center">
            <Clock className="w-8 h-8 mr-3 text-[color:var(--primary-2)]" />
            Activity History
        </h1>
        
        <div className="dc-card overflow-hidden">
          {error && (
            <div className="p-4" style={{ color: 'var(--danger)' }}>
              {error}
            </div>
          )}
          
          {loading ? (
             <div className="p-8 text-center text-[color:var(--muted)]">Loading history...</div>
          ) : history.length === 0 ? (
             <div className="p-12 text-center flex flex-col items-center">
                <Database className="w-12 h-12 text-[color:var(--muted-2)] mb-4" />
                <h3 className="text-lg font-semibold text-[color:var(--text)] mb-1">No Activity Yet</h3>
                <p className="text-[color:var(--muted)]">Upload a dataset and start cleaning to see your history here.</p>
             </div>
          ) : (
             <table className="min-w-full" style={{ borderTop: '1px solid var(--border)' }}>
                <thead style={{ backgroundColor: 'rgba(255,255,255,0.03)' }}>
                    <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-2)]">Date</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-2)]">Dataset</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-[color:var(--muted-2)]">Action Performed</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((item) => (
                        <tr key={item.history_id} className="transition-colors" style={{ borderTop: '1px solid var(--border)' }}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-[color:var(--muted)]">
                                {new Date(item.timestamp).toLocaleString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-[color:var(--text)]">
                                {item.dataset_name} <span className="text-xs text-[color:var(--muted-2)] ml-1">(ID: {item.dataset_id})</span>
                            </td>
                            <td className="px-6 py-4 text-sm text-[color:var(--muted)]">
                                {item.action}
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
