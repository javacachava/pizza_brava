import React from 'react';

interface Props {
  title: string;
  value: string | number;
  hint?: string;
  color?: string;
  icon?: string;
  trend?: number;
}

export const StatCard: React.FC<Props> = ({ title, value, hint, color = '#3182ce', icon, trend }) => {
  return (
    <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 12, borderLeft: `6px solid ${color}`, boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div>
        <div style={{ color: '#718096', fontSize: '0.9rem', fontWeight: 'bold' }}>{title}</div>
        <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#2d3748', marginTop: 5 }}>{value}</div>
        {hint && <div style={{ color: '#a0aec0', fontSize: '0.8rem', marginTop: 5 }}>{hint}</div>}
        {trend !== undefined && <div style={{ fontSize: '0.8rem', color: trend >= 0 ? '#38a169' : '#e53e3e', marginTop: 5 }}>{trend > 0 ? '+' : ''}{trend}%</div>}
      </div>
      {icon && <div style={{ fontSize: '2.5rem', opacity: 0.8 }}>{icon}</div>}
    </div>
  );
};
