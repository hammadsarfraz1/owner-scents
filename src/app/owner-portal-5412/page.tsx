'use client';

import { useEffect, useState } from 'react';
import styles from './admin.module.css';
import Link from 'next/link';
import { DollarSign, ShoppingBag, Clock, ArrowUpRight, TrendingUp, Sparkles, PackageCheck } from 'lucide-react';

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

    if (loading) {
        return (
            <div style={{ padding: '3rem 0', textAlign: 'center', color: '#a1a1aa' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                <span>Loading Executive Dashboard...</span>
            </div>
        );
    }

    const completedCount = stats.recentOrders.filter((o: any) => o.status.toUpperCase() === 'DELIVERED').length;

    return (
        <div>
            {/* Dashboard Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}>OVERVIEW</span>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginTop: '0.2rem', letterSpacing: '1px' }}>Executive Dashboard</h1>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <Link href="/owner-portal-5412/orders" className={styles.btnPrimary}>
                        <PackageCheck size={16} />
                        <span>Manage All Orders</span>
                    </Link>
                </div>
            </div>

            {/* Stats Cards Grid */}
            <div className={styles.statsGrid}>
                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>Total Revenue</span>
                        <div className={styles.statIcon} style={{ background: 'rgba(212, 175, 55, 0.15)', borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                            <DollarSign size={20} />
                        </div>
                    </div>
                    <div>
                        <div className={`${styles.statVal} ${styles.statValGold}`}>
                            Rs. {Number(stats.totalRevenue).toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.5rem' }}>
                            <TrendingUp size={12} /> Live Sales Volume
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>Total Orders</span>
                        <div className={styles.statIcon} style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#60a5fa', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                            <ShoppingBag size={20} />
                        </div>
                    </div>
                    <div>
                        <div className={styles.statVal}>{stats.totalOrders}</div>
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.5rem', display: 'block' }}>
                            Lifetime Customer Orders
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>Pending Fulfillment</span>
                        <div className={styles.statIcon} style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                            <Clock size={20} />
                        </div>
                    </div>
                    <div>
                        <div className={styles.statVal} style={{ color: '#fbbf24' }}>{stats.pendingOrders}</div>
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.5rem', display: 'block' }}>
                            Action Required in Orders
                        </span>
                    </div>
                </div>

                <div className={styles.statCard}>
                    <div className={styles.statHeader}>
                        <span className={styles.statTitle}>Storefront Status</span>
                        <div className={styles.statIcon} style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#34d399', borderColor: 'rgba(16, 185, 129, 0.3)' }}>
                            <Sparkles size={20} />
                        </div>
                    </div>
                    <div>
                        <div className={styles.statVal} style={{ fontSize: '1.8rem', color: '#34d399' }}>Active Cloud</div>
                        <span style={{ fontSize: '0.75rem', color: '#a1a1aa', marginTop: '0.5rem', display: 'block' }}>
                            Synced with Neon DB & Vercel
                        </span>
                    </div>
                </div>
            </div>

            {/* Recent Orders Table */}
            <div style={{ marginTop: '3rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '1px' }}>Recent Store Acquisitions</h2>
                    <Link href="/owner-portal-5412/orders" style={{ color: 'var(--accent)', fontSize: '0.85rem', textDecoration: 'none', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                        View All Orders <ArrowUpRight size={14} />
                    </Link>
                </div>

                <div className={styles.tableWrapper}>
                    {stats.recentOrders.length === 0 ? (
                        <div style={{ padding: '3rem', textAlign: 'center', color: '#a1a1aa' }}>
                            No recent transactions found.
                        </div>
                    ) : (
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Order ID</th>
                                    <th className={styles.th}>Client Name</th>
                                    <th className={styles.th}>Date</th>
                                    <th className={styles.th}>Total Amount</th>
                                    <th className={styles.th}>Fulfillment Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {stats.recentOrders.map((order: any) => {
                                    const s = (order.status || 'ORDERED').toUpperCase();
                                    let badgeStyle = styles.statusOrdered;
                                    if (s === 'PACKED') badgeStyle = styles.statusPacked;
                                    else if (s === 'SHIPPED') badgeStyle = styles.statusShipped;
                                    else if (s === 'DELIVERED') badgeStyle = styles.statusDelivered;
                                    else if (s === 'CANCELLED') badgeStyle = styles.statusCancelled;

                                    const dateStr = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'Recent';

                                    return (
                                        <tr key={order.id} className={styles.tr}>
                                            <td className={styles.td} style={{ fontWeight: 600, fontFamily: 'monospace', color: 'var(--accent)' }}>
                                                #{order.id.slice(-8).toUpperCase()}
                                            </td>
                                            <td className={styles.td} style={{ fontWeight: 500 }}>
                                                {order.shippingName || 'Valued Client'}
                                            </td>
                                            <td className={styles.td} style={{ color: '#a1a1aa', fontSize: '0.85rem' }}>
                                                {dateStr}
                                            </td>
                                            <td className={styles.td} style={{ fontWeight: 700 }}>
                                                Rs. {Number(order.total).toLocaleString()}
                                            </td>
                                            <td className={styles.td}>
                                                <span className={`${styles.statusBadge} ${badgeStyle}`}>
                                                    {s}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}
