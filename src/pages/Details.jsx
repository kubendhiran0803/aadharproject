import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowLeft } from 'lucide-react';

export default function Details() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // In a real app, this data would come from the backend via location.state or an API call.
  // We use fallback data if accessed directly.
  const aadharDetails = location.state?.details || {
    name: 'Ramesh Kumar',
    aadharNumber: 'XXXX XXXX 8291',
    dob: '15/08/1985',
    gender: 'Male'
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="page-header" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button 
          onClick={() => navigate('/')} 
          style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1>Verified Document Details</h1>
          <p>Extracted information from the Original Aadhar Card.</p>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <CheckCircle2 size={64} style={{ color: 'var(--success)', margin: '0 auto 1rem' }} />
          <h2 style={{ color: 'var(--success)' }}>ORIGINAL DOCUMENT</h2>
          <p style={{ color: 'var(--text-secondary)' }}>All security parameters passed validation.</p>
        </div>

        <div className="details-section" style={{ border: 'none', padding: 0 }}>
          <div className="detail-row" style={{ padding: '1rem 0' }}>
            <span className="detail-label">Name</span>
            <span className="detail-value">{aadharDetails.name}</span>
          </div>
          <div className="detail-row" style={{ padding: '1rem 0' }}>
            <span className="detail-label">Aadhar Number</span>
            <span className="detail-value">{aadharDetails.aadharNumber}</span>
          </div>
          <div className="detail-row" style={{ padding: '1rem 0' }}>
            <span className="detail-label">DOB</span>
            <span className="detail-value">{aadharDetails.dob}</span>
          </div>
          <div className="detail-row" style={{ padding: '1rem 0' }}>
            <span className="detail-label">Gender</span>
            <span className="detail-value">{aadharDetails.gender}</span>
          </div>
        </div>

        <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
          <button className="btn btn-primary" onClick={() => navigate('/')}>
            Return to Dashboard
          </button>
        </div>
      </div>
    </motion.div>
  );
}
