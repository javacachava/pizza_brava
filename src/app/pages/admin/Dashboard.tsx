import React, { useEffect, useState } from 'react';
import { container } from '../../../models/di/container';
import { SimpleChart } from '../../components/ui/SimpleChart';
import { StatCard } from '../../components/ui/StatCard';
import { Button } from '../../components/ui/Button';

export const Dashboard: React.FC = () => {
  const reportsService = container.reportsService;
  const [stats, setStats] = useState<any>(null);
  const [range, setRange] = useState<'day' | 'week' | 'month'>('day');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const data = await reportsService.getDashboardStats(range);
        setStats(data);
      } catch (e) {
        console.error(e); alert('Error cargando métricas');
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, [range]);

  if (!stats) return <div style={{ padding: 20 }}>{loading ? 'Cargando métricas...' : 'Sin datos'}</div>;

  return (
    <div className="printable-area">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
        <div>
          <h1 style={{ margin: 0 }}>Dashboard</h1>
          <p style={{ margin: 0, color: '#718096' }}>Resumen operativo</p>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <select value={range} onChange={e => setRange(e.target.value as any)} style={{ padding: 10, borderRadius: 6 }}>
            <option value="day">Hoy</option>
            <option value="week">Semana</option>
            <option value="month">Mes</option>
          </select>
          <Button variant="outline" onClick={() => window.print()}>🖨️ Imprimir</Button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px,1fr))', gap: 20, marginBottom: 30 }}>
        <StatCard title="Ventas Totales" value={`$${stats.totalSales.toFixed(2)}`} icon="💰" />
        <StatCard title="Órdenes" value={stats.totalOrders} icon="🧾" />
        <StatCard title="Ticket Promedio" value={`$${stats.averageTicket.toFixed(2)}`} icon="📊" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 25 }}>
        <SimpleChart title={`Top 5 Productos (${range === 'day' ? 'Hoy' : range === 'week' ? 'Semana' : 'Mes'})`} color="#ff6b00" data={stats.topProducts.map((p: any) => ({ label: p.name.slice(0, 15), value: p.count }))} />
        <div style={{ backgroundColor: 'white', padding: 20, borderRadius: 12 }}>
          <h3 style={{ marginTop: 0 }}>Detalle de Ventas</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {stats.topProducts.map((p: any, i: number) => (
              <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: 12, borderBottom: '1px dashed #edf2f7' }}>
                <div style={{ display: 'flex', gap: 10 }}>
                  <span style={{ backgroundColor: '#edf2f7', width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: 12 }}>{i + 1}</span>
                  <span>{p.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 'bold' }}>{p.count} und.</div>
                  <div style={{ color: '#718096' }}>${p.total.toFixed(2)}</div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
