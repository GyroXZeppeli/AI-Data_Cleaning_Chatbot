import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { Download } from 'lucide-react';
import api from '../../api/axios';

export default function DownloadData() {
  const [datasetId, setDatasetId] = useState('');
  const [format, setFormat] = useState('csv');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDownload = async () => {
    if (!datasetId) {
      setError("Dataset ID is required");
      return;
    }
    setLoading(true);
    setError('');

    try {
      const response = await api.get(`/download/${datasetId}?format=${format}`, {
        responseType: 'blob', // Important for downloading files
      });

      // Create a URL for the blob and download it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      
      // Attempt to get filename from content-disposition header if possible, else default
      let filename = `dataset_${datasetId}.${format}`;
      const contentDisposition = response.headers['content-disposition'];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (filenameMatch.length === 2) filename = filenameMatch[1];
      }
      
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);

    } catch {
      setError("Failed to download dataset. Check ID and format.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="dc-page">
        <div className="dc-page-header">
          <div>
            <div className="dc-page-kicker">Export</div>
            <h1 className="dc-page-title">Extract data</h1>
            <p className="dc-page-copy">Download a cleaned dataset as CSV, Excel, or JSON. The form now fits comfortably on both narrow and wide screens.</p>
          </div>
        </div>
        
        <div className="dc-card p-6 sm:p-8">
          <p className="text-[color:var(--muted)] mb-6">Download your cleaned dataset in your preferred format.</p>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-6">
            <div>
                 <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">Dataset ID</label>
                 <input 
                    type="number"
                    value={datasetId}
                    onChange={(e) => setDatasetId(e.target.value)}
                    placeholder="Enter Dataset ID"
                    className="dc-input"
                 />
            </div>
            <div>
                 <label className="block text-sm font-medium text-[color:var(--muted)] mb-2">Export Format</label>
                 <select 
                    value={format}
                    onChange={(e) => setFormat(e.target.value)}
                    className="dc-select"
                 >
                    <option value="csv">CSV (Comma Separated)</option>
                    <option value="xlsx">Excel (.xlsx)</option>
                    <option value="json">JSON Records</option>
                 </select>
            </div>
          </div>

          {error && (
            <div className="mb-4 text-sm" style={{ color: 'var(--danger)' }}>
              {error}
            </div>
          )}

          <button
             onClick={handleDownload}
             disabled={loading || !datasetId}
             className="w-full md:w-auto dc-btn-primary disabled:opacity-50 flex items-center justify-center"
          >
             <Download className="w-5 h-5 mr-2" />
             {loading ? 'Preparing Download...' : 'Download Cleaned Data'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
