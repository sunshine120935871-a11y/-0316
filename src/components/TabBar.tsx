import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const tabs = [
  { path: '/', label: '首页', icon: '🏠' },
  { path: '/consultation', label: '咨询', icon: '💬' },
  { path: '/profile', label: '我的', icon: '👤' },
];

const TabBar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      height: 56,
      background: '#fff',
      borderTop: '1px solid var(--border)',
      position: 'sticky',
      bottom: 0,
      zIndex: 100,
    }}>
      {tabs.map((tab) => (
        <button
          key={tab.path}
          onClick={() => navigate(tab.path)}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            fontSize: 11,
            color: isActive(tab.path) ? 'var(--primary)' : 'var(--text-hint)',
            fontWeight: isActive(tab.path) ? 600 : 400,
            background: 'none',
            border: 'none',
            padding: '4px 16px',
          }}
        >
          <span style={{ fontSize: 20 }}>{tab.icon}</span>
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

export default TabBar;
