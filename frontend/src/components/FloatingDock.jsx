import { LayoutDashboard, ShieldCheck, Fingerprint, GitFork, Droplets, FlaskConical } from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard',   label: 'Overview',   icon: LayoutDashboard },
  { id: 'verify',      label: 'Verify',     icon: ShieldCheck },
  { id: 'originate',   label: 'Register',   icon: Fingerprint },
  { id: 'transform',   label: 'Derive',     icon: GitFork },
  { id: 'watermark',   label: 'Watermark',  icon: Droplets },
  { id: 'adversarial', label: 'Sandbox',    icon: FlaskConical },
];

export default function FloatingDock({ activeTab, setActiveTab }) {
  return (
    <div className="floating-dock pill-nav">
      {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          className={`pill-nav-item${activeTab === id ? ' active' : ''}`}
          onClick={() => setActiveTab(id)}
          title={label}
        >
          <Icon size={14} strokeWidth={activeTab === id ? 2.5 : 2} />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
