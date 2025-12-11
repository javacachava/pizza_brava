import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, icon }) => {
  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border flex items-center gap-4">
      {icon && (
        <div className="text-3xl">
          {icon}
        </div>
      )}
      <div>
        <div className="text-gray-500 text-sm">{title}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
};
