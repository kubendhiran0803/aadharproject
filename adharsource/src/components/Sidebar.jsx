import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <ShieldCheck size={32} />
        <span className="text-gradient">AadharVerify</span>
      </div>
      
      <ul className="nav-menu">
        <li className="nav-item">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'active' : '')}>
            <LayoutDashboard size={20} />
            Dashboard
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink to="/verify" className={({ isActive }) => (isActive ? 'active' : '')}>
            <ShieldCheck size={20} />
            Verify Document
          </NavLink>
        </li>

      </ul>
    </aside>
  );
}
