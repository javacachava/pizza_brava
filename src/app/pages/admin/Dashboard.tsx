import React, { useEffect, useState } from 'react';
import { ReportsService } from '../../../services/domain/ReportsService';
import { SimpleChart } from './components/SimpleChart';
import { StatCard } from './components/StatCard';
import { Button } from '../../components/ui/Button';
import { useAdmin } from '../../../contexts/AdminContext';

export const Dashboard: React.FC = () => {
    const { setLoading } = useAdmin();
    const [stats, setStats] = useState<any>(null);
    const [range, setRange] = useState<'day' | 'week' | 'month'>('day');
    
    const reportsService = new ReportsService();

    useEffect(() => {
        const loadStats = async () => {
            setLoading(true);
            try {
                const data = await reportsService.getDashboardStats(range);
                setStats(data);
            } catch (error) {
                console.error("Error loading stats", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, [range]);

    if (!stats) return <div style={{ padding: '20px' }}>Cargando métricas...</div>;

    return (
        <div className="printable-area">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
                <div>
                    <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#2d3748' }}>Dashboard</h1>
                    <p style={{ margin: '5px 0 0 0', color: '#718096' }}>Resumen operativo de Pizza Brava</p>
                </div>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <select 
                        value={range} 
                        onChange={(e) => setRange(e.target.value as any)}
                        style={{ padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e0', backgroundColor: 'white' }}
                    >
                        <option value="day">Hoy</option>
                        <option value="week">Esta Semana</option>
                        <option value="month">Este Mes</option>
                    </select>
                    <Button onClick={() => window.print()} variant="outline">🖨️ Imprimir Reporte</Button>
                </div>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '30px' }}>
                <StatCard 
                    title="Ventas Totales" 
                    value={`$${stats.totalSales.toFixed(2)}`} 
                    icon="💰" 
                    trend={0} 
                    color="blue"
                />
                <StatCard 
                    title="Órdenes" 
                    value={stats.totalOrders} 
                    icon="🧾" 
                    color="green"
                />
                <StatCard 
                    title="Ticket Promedio" 
                    value={`$${stats.averageTicket.toFixed(2)}`} 
                    icon="📊" 
                    color="orange"
                />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '25px', alignItems: 'start' }}>
                {/* Gráfica */}
                <SimpleChart 
                    title={`Top 5 Productos (${range === 'day' ? 'Hoy' : range === 'week' ? 'Semana' : 'Mes'})`} 
                    color="#ff6b00"
                    data={stats.topProducts.map((p: any) => ({ label: p.name.slice(0, 15), value: p.count }))} 
                />
                
                {/* Lista Top */}
                <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
                    <h3 style={{ margin: '0 0 20px 0', fontSize: '1.1rem', color: '#2d3748', borderBottom: '1px solid #edf2f7', paddingBottom: '10px' }}>Detalle de Ventas</h3>
                    <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                        {stats.topProducts.length === 0 && <li style={{ color: '#a0aec0', textAlign: 'center' }}>Sin datos aún</li>}
                        {stats.topProducts.map((p: any, i: number) => (
                            <li key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px dashed #edf2f7' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ backgroundColor: '#edf2f7', width: '24px', height: '24px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 'bold', color: '#718096' }}>{i+1}</span>
                                    <span>{p.name}</span>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <div style={{ fontWeight: 'bold', color: '#2d3748' }}>{p.count} und.</div>
                                    <div style={{ fontSize: '0.8rem', color: '#718096' }}>${p.total.toFixed(2)}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
};