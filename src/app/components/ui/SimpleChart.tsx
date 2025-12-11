import React from 'react';

interface ChartData {
  label: string;
  value: number;
}

interface SimpleChartProps {
  title: string;
  data: ChartData[];
  color?: string;
}

export const SimpleChart: React.FC<SimpleChartProps> = ({ title, data, color = '#ff6b00' }) => {
  const max = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="bg-white p-5 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-4">{title}</h3>

      <div className="space-y-3">
        {data.map((d, i) => (
          <div key={i}>
            <div className="flex justify-between mb-1 text-sm">
              <span>{d.label}</span>
              <span>{d.value}</span>
            </div>

            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{
                  width: `${(d.value / max) * 100}%`,
                  backgroundColor: color
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
