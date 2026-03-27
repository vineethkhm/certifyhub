import React, { useState } from 'react';
import { Search, Loader2 } from 'lucide-react';
import api from '../../services/api';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Toast from '../../components/common/Toast';
import CertificateTemplate from '../../components/certificate/CertificateTemplate';
import './VerificationPage.css';

const VerificationPage = () => {
  const [certId, setCertId] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [searchStatus, setSearchStatus] = useState('idle'); // idle, found, not-found
  const [toast, setToast] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!certId.trim()) return;

    setIsSearching(true);
    setSearchStatus('idle');
    setCertificateData(null);

    try {
      const { data } = await api.get(`/certificates/${certId.trim()}`);
      setCertificateData(data);
      setSearchStatus('found');
    } catch (error) {
      if (error.response?.status === 404) {
        setSearchStatus('not-found');
      } else {
        setToast({ type: 'error', message: 'An error occurred during verification.' });
      }
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="verification-layout">
      <nav className="public-nav">
        <div className="container nav-container">
          <div className="logo">
            <div className="logo-icon">CH</div>
            <span>CertifyHub</span>
          </div>
          <a href="/login" className="admin-link">Admin Portal</a>
        </div>
      </nav>

      <main className="verification-main">
        <div className="container">
          <div className="hero-section">
            <h1 className="hero-title">Verify Internship Certificate</h1>
            <p className="hero-subtitle">Enter the unique credential ID below to verify the authenticity of the internship certificate.</p>

            <form onSubmit={handleSearch} className="search-form">
              <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                  type="text"
                  placeholder="e.g. CH-2023-XYZ123"
                  className="search-input"
                  value={certId}
                  onChange={(e) => setCertId(e.target.value)}
                  disabled={isSearching}
                />
              </div>
              <Button 
                type="submit" 
                size="lg" 
                isLoading={isSearching}
                disabled={!certId.trim()}
              >
                Verify
              </Button>
            </form>
          </div>

          <div className="result-section">
            {searchStatus === 'found' && certificateData && (
              <div className="result-card success-card animate-fade-in">
                <div className="status-badge success">
                  Valid Certificate ✅
                </div>
                <CertificateTemplate data={certificateData} />
              </div>
            )}

            {searchStatus === 'not-found' && (
              <div className="result-card error-card animate-fade-in">
                <div className="status-badge error">
                  Invalid Certificate ❌
                </div>
                <p>We couldn't find a certificate matching the ID: <strong>{certId}</strong></p>
                <p className="text-secondary text-sm mt-2">Please check the ID and try again, or contact the issuer.</p>
              </div>
            )}
          </div>
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

export default VerificationPage;
