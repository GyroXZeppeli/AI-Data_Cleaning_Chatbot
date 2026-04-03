import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Database, Wand2, Trash2, Edit3, Settings, AlertCircle } from 'lucide-react';
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
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
            <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] flex items-center">
                <Wand2 className="w-8 h-8 mr-3 text-[color:var(--primary-2)]" />
                Manual Cleaning
            </h1>
        </div>

        {/* Dataset Selection Mockup */}
        <div className="dc-card p-6">
            <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">Target Dataset ID</label>
            <input 
                type="number"
                value={datasetId}
                onChange={(e) => setDatasetId(e.target.value)}
                placeholder="Enter Dataset ID (e.g. 1)"
                className="dc-input md:w-64"
            />
        </div>

        {error && (
            <div className="p-4 rounded-xl flex items-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--danger)' }}>
                <AlertCircle className="w-5 h-5 mr-2" />
                {error}
            </div>
        )}

        {operationResult && (
            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex flex-col text-green-400">
                <span className="font-semibold">{operationResult.message}</span>
                {operationResult.new_stats && (
                    <span className="text-sm mt-1 opacity-80">
                        New dataset shape: {operationResult.new_stats.rows} rows, {operationResult.new_stats.columns} columns
                    </span>
                )}
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
            
            {/* Quick Actions */}
            <div className="dc-card p-6 space-y-4">
                <div className="flex items-center text-[color:var(--text)] font-semibold text-lg mb-2">
                    <Settings className="w-5 h-5 mr-2 text-[color:var(--muted-2)]" /> General Operations
                </div>
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

            {/* Column Operations */}
            <div className="dc-card p-6 space-y-4 lg:col-span-2">
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
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
                                className="w-full py-2 rounded-xl transition-colors border disabled:opacity-50"
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
