import React, { useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { Download } from 'lucide-react';
import Button from '../common/Button';
import './CertificateTemplate.css';

const CertificateTemplate = ({ data }) => {
  const certificateRef = useRef(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!certificateRef.current) return;
    
    setIsDownloading(true);
    try {
      // Create canvas with scale for better quality
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      
      // A4 landscape dimensions: 297mm x 210mm
      const pdf = new jsPDF('landscape', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      
      pdf.addImage(imgData, 'JPEG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`certificate-${data.certificateId}.pdf`);
    } catch (error) {
      console.error('Error generating PDF', error);
      alert('Failed to generate PDF. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="certificate-container">
      {/* Action Bar */}
      <div className="certificate-actions">
        <Button 
          onClick={handleDownload} 
          isLoading={isDownloading}
          icon={Download}
        >
          Download PDF
        </Button>
      </div>

      {/* Actual Certificate rendered in light mode (since it represents a physical paper) */}
      <div className="certificate-wrapper">
        <div className="certificate-paper" ref={certificateRef}>
          <div className="certificate-border-outer">
            <div className="certificate-border-inner">
              
              <div className="cert-header">
                <div className="cert-logo-container">
                  <div className="cert-logo">CH</div>
                </div>
                <h1 className="cert-title">Certificate of Internship</h1>
                <p className="cert-subtitle">This is to certify that</p>
              </div>

              <div className="cert-body">
                <h2 className="cert-student-name">{data.studentName}</h2>
                <div className="cert-text-block">
                  <p>
                    has successfully completed a rigorous internship program specializing in 
                    <strong className="cert-highlight"> {data.domain} </strong>.
                  </p>
                  <p className="cert-duration">
                    The internship was conducted from 
                    <br />
                    <span>{formatDate(data.startDate)}</span> to <span>{formatDate(data.endDate)}</span>.
                  </p>
                  <p className="cert-performance">
                    During this period, they consistently demonstrated exceptional dedication, profound understanding of core concepts, and outstanding practical execution.
                  </p>
                </div>
              </div>

              <div className="cert-footer">
                <div className="cert-signature-block left">
                  <div className="signature-line"></div>
                  <p className="signature-title">Program Director</p>
                </div>
                
                <div className="cert-seal">
                  <div className="seal-inner">
                    <span>SEAL</span>
                  </div>
                </div>

                <div className="cert-signature-block right">
                  <div className="signature-line"></div>
                  <p className="signature-title">Managing Director</p>
                </div>
              </div>
              
              <div className="cert-meta">
                <p>Certificate ID: <strong>{data.certificateId}</strong></p>
                <p>Verify at: certifyhub.com/verify</p>
                <p>Issued on: {formatDate(data.issuedAt)}</p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateTemplate;
