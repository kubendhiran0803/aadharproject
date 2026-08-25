import React from 'react';
import { motion } from 'framer-motion';
import { FileScan, ShieldAlert, ShieldCheck } from 'lucide-react';

export default function Dashboard() {
  const stats = [
    { label: 'Total Scans', value: '12,458', icon: FileScan, color: 'primary' },
    { label: 'Original Verified', value: '11,204', icon: ShieldCheck, color: 'success' },
    { label: 'Forgeries Detected', value: '1,254', icon: ShieldAlert, color: 'danger' }
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="page-header">
        <h1>Dashboard Overview</h1>
        <p>Monitor document verification statistics and recent activity.</p>
      </div>

      <div className="dashboard-grid">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="glass-panel stat-card"
            >
              <div className="stat-info">
                <h3>{stat.label}</h3>
                <div className="value">{stat.value}</div>
              </div>
              <div className={`stat-icon ${stat.color}`}>
                <Icon size={24} />
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem', borderBottom: '1px solid var(--glass-border)', paddingBottom: '1rem' }}>
          Recent Activity
        </h3>
        <div style={{ opacity: 0.7, padding: '2rem 0', textAlign: 'center' }}>
          No recent activity to display.
        </div>
      </div>
    </motion.div>
  );
}
