import { useState } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { UploadCloud, File, AlertCircle } from 'lucide-react';
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
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-semibold tracking-tight text-[color:var(--text)] mb-6">Upload Dataset</h1>
        
        <div 
          className="mt-2 flex justify-center px-6 pt-10 pb-12 border-2 border-dashed rounded-2xl transition-colors cursor-pointer"
          style={{
            borderColor: 'rgba(255,255,255,0.14)',
            background: 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
          }}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-upload').click()}
        >
          <div className="space-y-2 text-center">
            <UploadCloud className="mx-auto h-12 w-12 text-[color:var(--muted-2)]" />
            <div className="flex text-sm text-[color:var(--muted)] justify-center">
              <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-semibold text-[color:var(--primary-2)] hover:text-white focus-within:outline-none">
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-[color:var(--muted-2)]">
              CSV or Excel up to 50MB
            </p>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-4 rounded-xl flex items-center" style={{ backgroundColor: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.25)', color: 'var(--danger)' }}>
            <AlertCircle className="w-5 h-5 mr-2" />
            {error}
          </div>
        )}

        {file && (
          <div className="mt-6 dc-card p-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl" style={{ backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)' }}>
                <File className="w-6 h-6 text-[color:var(--primary-2)]" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[color:var(--text)]">{file.name}</p>
                <p className="text-xs text-[color:var(--muted)]">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleUpload();
              }}
              disabled={uploading}
              className="px-4 py-2 rounded-xl text-sm font-semibold disabled:opacity-50 dc-btn-primary"
            >
              {uploading ? 'Uploading...' : 'Process Dataset'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
