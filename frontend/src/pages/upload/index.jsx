import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { AlertCircle, File, UploadCloud } from 'lucide-react';
import api from '../../api/axios';

export default function UploadDataset() {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && (selected.type === 'text/csv' || selected.name.endsWith('.xlsx'))) {
      setFile(selected);
      setError('');
    } else {
      setFile(null);
      setError('Please upload a valid CSV or Excel file.');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && (droppedFile.type === 'text/csv' || droppedFile.name.endsWith('.xlsx'))) {
      setFile(droppedFile);
      setError('');
    } else {
      setError('Please drop a valid CSV or Excel file.');
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.post('/datasets/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      alert(`Upload successful! Detected ${response.data.analysis.summary.rows} rows and ${response.data.analysis.summary.columns} columns.`);
      // TODO: Redirect to analysis view or save state
    } catch (err) {
      setError(err.response?.data?.detail || 'An error occurred during upload.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="dc-page">
        <div className="dc-page-header">
          <div>
            <div className="dc-page-kicker">Ingestion</div>
            <h1 className="dc-page-title">Upload a dataset</h1>
            <p className="dc-page-copy">Start with a CSV or Excel file. The app will profile the file immediately after upload so you can move into cleaning or insights without extra setup.</p>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.15fr)_22rem]">
          <div
            className="dc-card flex min-h-[340px] cursor-pointer items-center justify-center px-6 py-10 text-center sm:px-10"
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            onClick={() => document.getElementById('file-upload').click()}
          >
            <div className="w-full max-w-xl rounded-[1.75rem] border border-dashed px-6 py-10 sm:px-10 sm:py-12" style={{ borderColor: 'rgba(148, 163, 184, 0.26)', backgroundColor: 'rgba(255,255,255,0.02)' }}>
              <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl border" style={{ borderColor: 'rgba(56, 189, 248, 0.22)', backgroundColor: 'rgba(15, 157, 138, 0.12)' }}>
                <UploadCloud className="h-8 w-8 text-[color:var(--primary-2)]" />
              </div>
              <h2 className="mt-5 text-2xl font-bold tracking-tight">Drop your file here</h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[color:var(--muted)]">
                Drag and drop a CSV or Excel file, or click to browse. Larger desktops keep the drop zone prominent while mobile still preserves a clear tap target.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-2 text-sm text-[color:var(--muted)]">
                <label htmlFor="file-upload" className="cursor-pointer font-semibold text-[color:var(--primary-2)] hover:text-white">
                  Choose file
                </label>
                <span>or drag and drop</span>
              </div>
              <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
              <p className="mt-4 text-xs uppercase tracking-[0.2em] text-[color:var(--muted-2)]">CSV or Excel up to 50MB</p>
            </div>
          </div>

          <aside className="dc-card p-6">
            <div className="dc-page-kicker">Checklist</div>
            <h2 className="text-xl font-bold tracking-tight">Before you upload</h2>
            <ul className="mt-5 space-y-4 text-sm leading-6 text-[color:var(--muted)]">
              <li>Use CSV or `.xlsx` only.</li>
              <li>Keep header names readable so cleaning actions are easier to target.</li>
              <li>Once uploaded, note the dataset ID for cleaning, insights, and download screens.</li>
            </ul>
          </aside>
        </div>

        {error && (
          <div className="rounded-2xl p-4 flex items-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--danger)' }}>
            <AlertCircle className="mr-2 h-5 w-5" />
            {error}
          </div>
        )}

        {file && (
          <div className="dc-card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex min-w-0 items-center gap-3">
              <div className="rounded-2xl border p-3" style={{ backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'var(--border)' }}>
                <File className="h-6 w-6 text-[color:var(--primary-2)]" />
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[color:var(--text)]">{file.name}</p>
                <p className="text-xs text-[color:var(--muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB ready to process</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={uploading}
              className="dc-btn-primary disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Process Dataset'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
