import React, { useState } from 'react';
import { motion } from 'framer-motion';
import UploadDropzone from '../components/UploadDropzone';
import VerificationStatus from '../components/VerificationStatus';
import { ArrowLeft } from 'lucide-react';

export default function VerificationPage() {
  const [file, setFile] = useState(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const startVerification = () => {
    if (file) {
      setIsVerifying(true);
    }
  };

  const reset = () => {
    setFile(null);
    setIsVerifying(false);
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        {isVerifying && (
          <button onClick={reset} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <ArrowLeft size={24} />
          </button>
        )}
        <div>
          <h1>Document Verification</h1>
          <p>{isVerifying ? 'Analyzing document...' : 'Upload an Aadhar card to verify its authenticity.'}</p>
        </div>
      </div>

      {!isVerifying ? (
        <div className="upload-container">
          <UploadDropzone onFileSelect={handleFileSelect} />
          
          {file && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: 'center', marginTop: '2rem' }}
            >
              <button className="btn btn-primary" onClick={startVerification}>
                Start Verification Scan
              </button>
            </motion.div>
          )}
        </div>
      ) : (
        <VerificationStatus file={file} onReset={reset} />
      )}
    </motion.div>
  );
}
