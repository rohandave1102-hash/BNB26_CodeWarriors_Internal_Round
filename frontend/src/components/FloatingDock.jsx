import React from 'react';
import { ShieldCheck, PlusCircle, GitBranch, Eye, Zap } from 'lucide-react';

export default function FloatingDock({ activeTab, setActiveTab }) {
  const routes = [
    { id: 'verify', label: 'Verify & Forensics', icon: ShieldCheck, badge: 'Dual-Hash' },
    { id: 'originate', label: 'Originate', icon: PlusCircle },
    { id: 'transform', label: 'Edit History', icon: GitBranch },
    { id: 'watermark', label: 'Stegano Watermark', icon: Eye, badge: 'LSB' },
    { id: 'adversarial', label: 'Attack Sandbox', icon: Zap, highlight: true }
  ];

  return (
    <div className="floating-dock">
      {routes.map((route) => {
        const Icon = route.icon;
        const isActive = activeTab === route.id;

        return (
          <button
            key={route.id}
            onClick={() => setActiveTab(route.id)}
            className={`dock-item ${isActive ? 'active' : ''}`}
          >
            <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
            <span>{route.label}</span>
            {route.badge && (
              <span style={{
                fontSize: '0.6rem',
                padding: '2px 6px',
                borderRadius: '999px',
                background: isActive ? 'rgba(3, 7, 18, 0.3)' : 'rgba(16, 185, 129, 0.2)',
                color: isActive ? '#030712' : 'var(--neon-emerald)',
                fontWeight: 800,
                letterSpacing: '0.04em'
              }}>
                {route.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
