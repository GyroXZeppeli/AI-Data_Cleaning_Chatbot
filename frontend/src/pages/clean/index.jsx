import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AlertCircle, Edit3, Settings, Trash2, Wand2 } from 'lucide-react';
import api from '../../api/axios';

export default function ManualCleaning() {
  const [datasetId, setDatasetId] = useState('');
  const [operationResult, setOperationResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Form states for different operations
  const [selectedColumn, setSelectedColumn] = useState('');
  const [fillMethod, setFillMethod] = useState('mean');
  const [fillValue, setFillValue] = useState('');
  
  // Note: For a complete app, we would fetch the list of user's datasets 
  // and populate a dropdown, then fetch columns for the selected dataset.
  // For simplicity in this structure, we allow manual entry of dataset ID and column names.

  const executeOperation = async (op, params = {}) => {
    if (!datasetId) {
      setError("Please enter a Dataset ID");
      return;
    }
    setLoading(true);
    setError(null);
    setOperationResult(null);

    try {
      const response = await api.post('/clean/', {
        dataset_id: parseInt(datasetId),
        operation: op,
        params: params
      });
      setOperationResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="dc-page">
        <div className="dc-page-header">
          <div>
            <div className="dc-page-kicker">Cleaning</div>
            <h1 className="dc-page-title">Manual cleaning controls</h1>
            <p className="dc-page-copy">Use the dataset ID from your upload step, then apply targeted operations without leaving the workspace. Controls now stack cleanly on small screens and keep related actions grouped on larger ones.</p>
          </div>
        </div>

        <div className="dc-card p-6 sm:p-7">
            <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">Target dataset ID</label>
            <input 
                type="number"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                placeholder="Enter Dataset ID (e.g. 1)"
                className="dc-input w-full sm:max-w-xs"
            />
        </div>

        {error && (
            <div className="rounded-2xl p-4 flex items-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--danger)' }}>
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
            </div>
        )}

        {operationResult && (
            <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-4 text-emerald-300">
                <span className="font-semibold">{operationResult.message}</span>
                {operationResult.new_stats && (
                    <span className="text-sm mt-1 opacity-80">
                        New dataset shape: {operationResult.new_stats.rows} rows, {operationResult.new_stats.columns} columns
                    </span>
                )}
            </div>
        )}

        <div className="grid gap-6 xl:grid-cols-[minmax(260px,0.8fr)_minmax(0,1.2fr)] text-sm">
            
            <div className="dc-card p-6 space-y-4">
                <div className="flex items-center text-[color:var(--text)] font-semibold text-lg mb-2">
                    <Settings className="w-5 h-5 mr-2 text-[color:var(--muted-2)]" /> General Operations
                </div>
                <p className="text-[color:var(--muted)] leading-6">
                  Use these for broad cleanup passes before you target a specific column.
                </p>
                <button 
                    onClick={() => executeOperation('drop_duplicates')}
                    disabled={loading}
                    className="w-full dc-btn-secondary py-2 px-4 flex items-center justify-between"
                >
                    <span>Remove Duplicates</span>
                    <Trash2 className="w-4 h-4 text-[color:var(--muted-2)]" />
                </button>
                <button 
                    onClick={() => executeOperation('drop_missing')}
                    disabled={loading}
                    className="w-full dc-btn-secondary py-2 px-4 flex items-center justify-between"
                >
                    <span>Drop All Missing Rows</span>
                    <Trash2 className="w-4 h-4 text-[color:var(--muted-2)]" />
                </button>
            </div>

            <div className="dc-card p-6 space-y-4">
                <div className="flex items-center text-[color:var(--text)] font-semibold text-lg mb-4">
                    <Edit3 className="w-5 h-5 mr-2 text-[color:var(--muted-2)]" /> Column Operations
                </div>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-xs text-[color:var(--muted)] mb-1">Target Column Name</label>
                        <input 
                            type="text"
                            value={selectedColumn}
                            onChange={(e) => setSelectedColumn(e.target.value)}
                            placeholder="e.g. age, salary"
                            className="dc-input px-3 py-2"
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 border-t pt-4 lg:grid-cols-2" style={{ borderColor: 'var(--border)' }}>
                         <div className="space-y-2">
                            <label className="block text-xs text-[color:var(--muted)]">Fill Method</label>
                            <select 
                                value={fillMethod}
                                onChange={(e) => setFillMethod(e.target.value)}
                                className="dc-select px-3 py-2"
                            >
                                <option value="mean">Mean</option>
                                <option value="median">Median</option>
                                <option value="mode">Mode</option>
                                <option value="constant">Constant</option>
                            </select>
                            {fillMethod === 'constant' && (
                                <input placeholder="Value" value={fillValue} onChange={e => setFillValue(e.target.value)} className="dc-input mt-2 px-3 py-2" />
                            )}
                            <button 
                                onClick={() => executeOperation('fill_missing', { column: selectedColumn, method: fillMethod, value: fillValue })}
                                disabled={loading || !selectedColumn}
                                className="w-full dc-btn-primary py-2 disabled:opacity-50"
                            >
                                Fill Missing
                            </button>
                         </div>

                         <div className="space-y-2">
                            <label className="block text-xs text-[color:var(--muted)]">Other Actions</label>
                            <button 
                                onClick={() => executeOperation('remove_outliers', { column: selectedColumn })}
                                disabled={loading || !selectedColumn}
                                className="w-full dc-btn-secondary py-2 disabled:opacity-50"
                            >
                                Remove Outliers
                            </button>
                            <button 
                                onClick={() => executeOperation('drop_column', { column: selectedColumn })}
                                disabled={loading || !selectedColumn}
                                className="w-full rounded-xl border py-2 transition-colors disabled:opacity-50"
                                style={{
                                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                                  borderColor: 'rgba(239, 68, 68, 0.25)',
                                  color: 'rgba(254, 226, 226, 0.95)',
                                }}
                            >
                                Drop Column
                            </button>
                         </div>
                    </div>
                </div>
            </div>

        </div>
      </div>
    </DashboardLayout>
  );
}
