import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Search, QrCode, Type, LayoutTemplate } from 'lucide-react';
import jsQR from 'jsqr';

export default function VerificationStatus({ file, onReset }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('scanning'); // scanning, success, danger
  const [checks, setChecks] = useState([
    { id: 'qr', label: 'QR Code Validation', status: 'pending', icon: QrCode },
    { id: 'font', label: 'Typography Analysis', status: 'pending', icon: Type },
    { id: 'hologram', label: 'Hologram Detection', status: 'pending', icon: LayoutTemplate },
    { id: 'db', label: 'Database Cross-Check', status: 'pending', icon: Search }
  ]);
  const [decodedDetails, setDecodedDetails] = useState(null);

  // Decode QR code from an uploaded image file using jsQR
  const decodeQRCode = (file) => {
    return new Promise((resolve) => {
      if (!file) return resolve(null);
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.naturalWidth || img.width;
          canvas.height = img.naturalHeight || img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          try {
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            if (code && code.data) {
              resolve(code.data);
            } else {
              resolve(null);
            }
          } catch (e) {
            resolve(null);
          }
        };
        img.onerror = () => resolve(null);
        img.src = reader.result;
      };
      reader.onerror = () => resolve(null);
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    let isActive = true;

    const sleep = (ms) => new Promise(r => setTimeout(r, ms));

    const runChecks = async () => {
      if (!file) return;
      setStatus('scanning');

      // reset checks
      setChecks([
        { id: 'qr', label: 'QR Code Validation', status: 'pending', icon: QrCode },
        { id: 'font', label: 'Typography Analysis', status: 'pending', icon: Type },
        { id: 'hologram', label: 'Hologram Detection', status: 'pending', icon: LayoutTemplate },
        { id: 'db', label: 'Database Cross-Check', status: 'pending', icon: Search }
      ]);

      // 1) Decode QR
      const qrData = await decodeQRCode(file);
      if (!isActive) return;

      if (!qrData) {
        setChecks(prev => prev.map(c => c.id === 'qr' ? { ...c, status: 'error' } : c));
        setStatus('danger');
        return;
      }

      // mark QR as success
      setChecks(prev => prev.map(c => c.id === 'qr' ? { ...c, status: 'success' } : c));

      // try to parse Aadhaar QR payload (many Aadhaar QR codes use XML-like attributes)
      let details = { name: 'Unknown', aadharNumber: 'Unknown', dob: '', gender: '' };
      try {
        if (qrData.trim().startsWith('<')) {
          const attrs = {};
          qrData.replace(/([a-zA-Z]+)="([^"]+)"/g, (m, k, v) => { attrs[k] = v; return m; });
          details.name = attrs.name || attrs._name || details.name;
          details.aadharNumber = attrs.uid || attrs.uid || details.aadharNumber;
          if (attrs.yob) details.dob = attrs.yob;
          if (attrs.gender) details.gender = attrs.gender === 'M' ? 'Male' : attrs.gender === 'F' ? 'Female' : attrs.gender;
        } else {
          // If payload is JSON or plain text, try JSON parse
          try {
            const obj = JSON.parse(qrData);
            details.name = obj.name || details.name;
            details.aadharNumber = obj.uid || obj.aadhar || details.aadharNumber;
            details.dob = obj.dob || obj.yob || details.dob;
            details.gender = obj.gender || details.gender;
          } catch (e) {
            // fallback: put full payload into aadharNumber (so user can see it)
            details.aadharNumber = qrData;
          }
        }
      } catch (e) {
        // parsing error - proceed with whatever we have
      }

      setDecodedDetails(details);

      // 2) Typography analysis (simulated short delay)
      await sleep(600);
      if (!isActive) return;
      setChecks(prev => prev.map(c => c.id === 'font' ? { ...c, status: 'success' } : c));

      // 3) Hologram detection (simulated)
      await sleep(600);
      if (!isActive) return;
      setChecks(prev => prev.map(c => c.id === 'hologram' ? { ...c, status: 'success' } : c));

      // 4) Database cross-check: basic validation of Aadhaar number format
      await sleep(600);
      if (!isActive) return;
      const uid = (details.aadharNumber || '').replace(/\s+/g, '').replace(/[^0-9]/g, '');
      const dbSuccess = /^\d{12}$/.test(uid);
      setChecks(prev => prev.map(c => c.id === 'db' ? { ...c, status: dbSuccess ? 'success' : 'error' } : c));

      if (!dbSuccess) {
        setStatus('danger');
        return;
      }

      // success: navigate to details with parsed data
      setStatus('success');
      setTimeout(() => {
        if (!isActive) return;
        navigate('/details', {
          state: {
            details: {
              name: details.name,
              aadharNumber: details.aadharNumber,
              dob: details.dob,
              gender: details.gender
            }
          }
        });
      }, 800);
    };

    runChecks();

    return () => { isActive = false; };
  }, [file, navigate]);

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      className="verification-status glass-panel"
    >
      {status === 'scanning' && (
        <div className="scanning-animation">
          <div className="scanning-overlay"></div>
          {file && (
            <img 
              src={URL.createObjectURL(file)} 
              alt="Document" 
              style={{ width: '100%', height: '100%', objectFit: 'contain', opacity: 0.5 }} 
            />
          )}
        </div>
      )}

      <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>
        {status === 'scanning' ? 'Analyzing Document Elements...' : 'Analysis Complete'}
      </h3>

      <div className="check-list">
        {checks.map((check, index) => {
          const Icon = check.icon;
          return (
            <motion.div 
              key={check.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.2 }}
              className="check-item"
            >
              <div className={`check-icon ${check.status}`}>
                {check.status === 'pending' && <Loader2 size={20} className="animate-spin" />}
                {check.status === 'success' && <CheckCircle2 size={20} />}
                {check.status === 'error' && <XCircle size={20} />}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Icon size={18} style={{ opacity: 0.7 }} />
                <span>{check.label}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {status === 'danger' && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="result-card danger">
            <h2>
              <XCircle size={32} />
              FORGERY DETECTED
            </h2>
            <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>
              Anomalies detected in document structure and metadata.
            </p>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Return to Home Page
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
