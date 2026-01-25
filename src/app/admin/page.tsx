'use client';

import { useEffect, useState } from 'react';
import styles from './admin.module.css';

export default function AdminDashboard() {
    const [stats, setStats] = useState({
        totalOrders: 0,
        pendingOrders: 0,
        totalRevenue: 0,
        recentOrders: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/admin/stats')
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Failed to fetch stats');
            })
            .then(data => {
                setStats(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) return <div>Loading Stats...</div>;

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Dashboard Overview</h1>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Revenue</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: 'var(--gold-highlight)', marginTop: '0.5rem' }}>
                        ${Number(stats.totalRevenue).toFixed(2)}
                    </p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Total Orders</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>{stats.totalOrders}</p>
                </div>

                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Pending Orders</h3>
                    <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#e5bf48', marginTop: '0.5rem' }}>{stats.pendingOrders}</p>
                </div>
            </div>

            <div style={{ marginTop: '4rem', padding: '2rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                <h2 style={{ fontFamily: 'var(--font-serif)', marginBottom: '1rem' }}>Recent Activity</h2>
                {stats.recentOrders.length === 0 ? (
                    <p style={{ color: 'var(--text-secondary)' }}>No recent orders found.</p>
                ) : (
                    <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ color: 'var(--text-secondary)', borderBottom: '1px solid var(--border-color)' }}>
                                <th style={{ padding: '1rem' }}>Order ID</th>
                                <th style={{ padding: '1rem' }}>Customer</th>
                                <th style={{ padding: '1rem' }}>Total</th>
                                <th style={{ padding: '1rem' }}>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats.recentOrders.map((order: any) => (
                                <tr key={order.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem' }}>#{order.id.slice(-6)}</td>
                                    <td style={{ padding: '1rem' }}>{order.shippingName}</td>
                                    <td style={{ padding: '1rem' }}>${Number(order.total).toFixed(2)}</td>
                                    <td style={{ padding: '1rem' }}>{order.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
