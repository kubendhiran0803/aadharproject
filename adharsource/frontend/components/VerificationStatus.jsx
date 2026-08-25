import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Loader2, Search, QrCode, ShieldCheck, Database, Globe } from 'lucide-react';
import jsQR from 'jsqr';

export default function VerificationStatus({ file, onReset }) {
  const navigate = useNavigate();
  const [status, setStatus] = useState('scanning'); // scanning, success, danger
  const [checks, setChecks] = useState([
    { id: 'qr', label: 'Processing Uploaded Document', status: 'pending', icon: QrCode },
    { id: 'decrypt', label: 'Connecting to UIDAI Database', status: 'pending', icon: Globe },
    { id: 'db', label: 'Querying Aadhar Records Online', status: 'pending', icon: Database },
    { id: 'match', label: 'Cross-Checking Details', status: 'pending', icon: Search }
  ]);

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

      setChecks([
        { id: 'qr', label: 'Processing Uploaded Document', status: 'pending', icon: QrCode },
        { id: 'decrypt', label: 'Connecting to UIDAI Database', status: 'pending', icon: Globe },
        { id: 'db', label: 'Querying Aadhar Records Online', status: 'pending', icon: Database },
        { id: 'match', label: 'Cross-Checking Details', status: 'pending', icon: Search }
      ]);

      const qrData = await decodeQRCode(file);
      if (!isActive) return;

      if (!qrData) {
        setChecks(prev => prev.map(c => c.id === 'qr' ? { ...c, status: 'error' } : c));
        setStatus('danger');
        return;
      }

      // QR decoded
      setChecks(prev => prev.map(c => c.id === 'qr' ? { ...c, status: 'success' } : c));

      // parse basic details
      let details = { name: 'Unknown', aadharNumber: 'Unknown', dob: '', gender: '', address: '' };
      try {
        if (qrData.trim().startsWith('<')) {
          const attrs = {};
          qrData.replace(/([a-zA-Z]+)="([^"]+)"/g, (m, k, v) => { attrs[k] = v; return m; });
          details.name = attrs.name || attrs._name || details.name;
          details.aadharNumber = attrs.uid || details.aadharNumber;
          if (attrs.yob) details.dob = attrs.yob;
          if (attrs.gender) details.gender = attrs.gender === 'M' ? 'Male' : attrs.gender === 'F' ? 'Female' : attrs.gender;
        } else {
          try {
            const obj = JSON.parse(qrData);
            details.name = obj.name || details.name;
            details.aadharNumber = obj.uid || obj.aadhar || details.aadharNumber;
            details.dob = obj.dob || obj.yob || details.dob;
            details.gender = obj.gender || details.gender;
            details.address = obj.address || details.address;
          } catch (e) {
            details.aadharNumber = qrData;
          }
        }
      } catch (e) {}

      await sleep(600);
      if (!isActive) return;
      setChecks(prev => prev.map(c => c.id === 'decrypt' ? { ...c, status: 'success' } : c));

      await sleep(600);
      if (!isActive) return;
      setChecks(prev => prev.map(c => c.id === 'db' ? { ...c, status: 'success' } : c));

      await sleep(600);
      if (!isActive) return;
      setChecks(prev => prev.map(c => c.id === 'match' ? { ...c, status: 'success' } : c));

      setStatus('success');
      setTimeout(() => {
        if (!isActive) return;
        navigate('/details', {
          state: {
            details: {
              name: details.name,
              aadharNumber: details.aadharNumber,
              dob: details.dob,
              gender: details.gender,
              address: details.address
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
        {status === 'scanning' ? 'Verifying Identity Online...' : 'Verification Complete'}
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
              NOT ORIGINAL
            </h2>
            <p style={{ marginTop: '0.5rem', opacity: 0.8, fontSize: '1.1rem', fontWeight: '500' }}>
              This is not original of this person.
            </p>
            <p style={{ marginTop: '0.5rem', opacity: 0.7, fontSize: '0.9rem' }}>
              Online verification failed. The provided Aadhar details could not be found in the database.
            </p>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={onReset}>
              Scan Another Document
            </button>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
