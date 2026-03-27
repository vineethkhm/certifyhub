import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, LogOut, FileText, Search, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState(null);
  
  const [certificates, setCertificates] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/certificates');
      setCertificates(data);
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to fetch certificates' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      setToast({ type: 'error', message: 'Please select an excel file' });
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setIsUploading(true);
      const { data } = await api.post('/certificates/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setToast({ type: 'success', message: data.message });
      setFile(null);
      // Reset input file
      document.getElementById('file-upload').value = '';
      fetchCertificates();
    } catch (error) {
      setToast({ 
        type: 'error', 
        message: error.response?.data?.message || 'Upload failed' 
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this certificate?')) return;
    
    try {
      await api.delete(`/certificates/${id}`);
      setCertificates(certificates.filter(cert => cert._id !== id));
      setToast({ type: 'success', message: 'Certificate deleted successfully' });
    } catch (error) {
      setToast({ type: 'error', message: 'Failed to delete certificate' });
    }
  };

  const filteredCertificates = certificates.filter(cert => 
    cert.certificateId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.studentName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="layout-admin">
      {/* Sidebar Layout */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="sidebar-logo">CH</div>
          <span>CertifyHub Admin</span>
        </div>
        
        <nav className="sidebar-nav">
          <a href="#" className="nav-item active">
            <FileText size={20} />
            Certificates
          </a>
        </nav>
        
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0) || 'A'}</div>
            <span className="user-name">{user?.name || 'Admin'}</span>
          </div>
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="page-header">
          <h1>Dashboard</h1>
          <p className="text-secondary">Manage and upload student certificates.</p>
        </header>

        <div className="content-grid">
          
          {/* Upload Section */}
          <section className="card upload-card animate-fade-in">
            <h2>Batch Upload</h2>
            <p className="text-secondary text-sm mb-4">Upload an Excel (.xlsx) or CSV file. Required columns: certificateId, studentName, domain, startDate, endDate.</p>
            
            <form onSubmit={handleUpload} className="upload-form">
              <div className="file-input-wrapper">
                <input 
                  type="file" 
                  id="file-upload" 
                  accept=".xlsx, .xls, .csv" 
                  onChange={handleFileChange}
                  className="file-input"
                />
                <label htmlFor="file-upload" className={`file-drop-zone ${file ? 'has-file' : ''}`}>
                  <UploadCloud size={32} className="text-primary mb-2" />
                  <span className="file-name font-medium">
                    {file ? file.name : 'Click or drag file to upload'}
                  </span>
                  <span className="text-xs text-muted mt-1">
                    {file ? `${(file.size / 1024).toFixed(1)} KB` : 'Excel or CSV up to 5MB'}
                  </span>
                </label>
              </div>
              
              <Button 
                type="submit" 
                className="mt-4" 
                isLoading={isUploading}
                disabled={!file}
              >
                Upload Certificates
              </Button>
            </form>
          </section>

          {/* List Section */}
          <section className="card list-card animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <div className="list-header">
              <h2>Recent Certificates</h2>
              <div className="search-bar">
                <Search size={16} className="text-muted" />
                <input 
                  type="text" 
                  placeholder="Search by ID or Name..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="table-responsive">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Student Name</th>
                    <th>Domain</th>
                    <th>Duration</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8">
                        <span className="loading-state">Loading data...</span>
                      </td>
                    </tr>
                  ) : filteredCertificates.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center py-8 text-secondary">
                        No certificates found.
                      </td>
                    </tr>
                  ) : (
                    filteredCertificates.map(cert => (
                      <tr key={cert._id}>
                        <td className="font-medium">{cert.certificateId}</td>
                        <td>{cert.studentName}</td>
                        <td>{cert.domain}</td>
                        <td className="text-sm text-secondary">
                          {new Date(cert.startDate).toLocaleDateString()} - {new Date(cert.endDate).toLocaleDateString()}
                        </td>
                        <td>
                          <button 
                            className="btn-icon-danger"
                            onClick={() => handleDelete(cert._id)}
                            title="Delete"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>

      {toast && (
        <Toast 
          type={toast.type} 
          message={toast.message} 
          onClose={() => setToast(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;
