'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';
import { 
    TrendingUp, 
    DollarSign, 
    ShoppingBag, 
    Layers, 
    Award, 
    Calendar, 
    PieChart, 
    BarChart2,
    RotateCcw,
    XCircle,
    CheckCircle2,
    RefreshCw
} from 'lucide-react';

type AnalyticsData = {
    kpis: {
        grossRevenue: number;
        netRevenue: number;
        returnedValue: number;
        refundedValue: number;
        totalOrders: number;
        deliveredOrders: number;
        returnedOrders: number;
        cancelledOrders: number;
        pendingOrders: number;
        refundedOrders: number;
        averageOrderValue: number;
        totalItemsSold: number;
    };
    monthlySales: { month: string; revenue: number; orders: number; returned: number }[];
    yearlySales: { year: string; revenue: number; orders: number }[];
    categorySales: { category: string; revenue: number; percentage: number }[];
    topProducts: { name: string; image: string; qty: number; revenue: number }[];
};

export default function AdminAnalytics() {
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'monthly' | 'yearly'>('monthly');

    useEffect(() => {
        fetch('/api/admin/analytics?t=' + Date.now())
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Failed to fetch analytics');
            })
            .then(resData => {
                setData(resData);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    if (loading) {
        return (
            <div style={{ padding: '4rem 0', textAlign: 'center', color: '#a1a1aa' }}>
                <div style={{ width: '45px', height: '45px', borderRadius: '50%', border: '3px solid #3b82f6', borderTopColor: 'transparent', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                <span>Analyzing Storefront Database & Logistics Intelligence...</span>
            </div>
        );
    }

    if (!data) return <div style={{ padding: '2rem', color: '#ef4444' }}>Failed to load analytics intelligence.</div>;

    const maxMonthlyRevenue = Math.max(...data.monthlySales.map(m => m.revenue), 1);
    const maxYearlyRevenue = Math.max(...data.yearlySales.map(y => y.revenue), 1);

    return (
        <div>
            {/* Page Title & View Toggles */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <span style={{ fontSize: '0.75rem', color: '#60a5fa', letterSpacing: '3px', textTransform: 'uppercase', fontWeight: 600 }}>EXECUTIVE INTELLIGENCE</span>
                    <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.4rem', marginTop: '0.2rem', letterSpacing: '1px' }}>Store Analytics & Logistics</h1>
                </div>

                <div style={{ display: 'flex', background: '#18181b', padding: '0.35rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                    <button
                        onClick={() => setViewMode('monthly')}
                        style={{
                            background: viewMode === 'monthly' ? '#3b82f6' : 'transparent',
                            color: viewMode === 'monthly' ? '#ffffff' : '#a1a1aa',
                            border: 'none',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}
                    >
                        <Calendar size={14} /> 2026 Monthly Breakdown
                    </button>
                    <button
                        onClick={() => setViewMode('yearly')}
                        style={{
                            background: viewMode === 'yearly' ? '#3b82f6' : 'transparent',
                            color: viewMode === 'yearly' ? '#ffffff' : '#a1a1aa',
                            border: 'none',
                            padding: '0.5rem 1.25rem',
                            borderRadius: '6px',
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.4rem'
                        }}
                    >
                        <BarChart2 size={14} /> Yearly Comparison
                    </button>
                </div>
            </div>

            {/* Key Performance Indicators (Top 4 Cards - Compact Matching Bottom Row) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
                <div className={styles.statCard} style={{ padding: '1.25rem 1.5rem' }}>
                    <div className={styles.statHeader} style={{ marginBottom: '0.75rem' }}>
                        <span className={styles.statTitle}>Total Gross Revenue</span>
                        <div className={styles.statIcon} style={{ width: '36px', height: '36px' }}>
                            <DollarSign size={18} />
                        </div>
                    </div>
                    <div>
                        <div className={`${styles.statVal} ${styles.statValBlue}`} style={{ fontSize: '1.8rem' }}>
                            Rs. {data.kpis.grossRevenue.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#34d399', display: 'inline-flex', alignItems: 'center', gap: '0.2rem', marginTop: '0.35rem' }}>
                            <TrendingUp size={11} /> Total Placed Volume
                        </span>
                    </div>
                </div>

                <div className={styles.statCard} style={{ padding: '1.25rem 1.5rem' }}>
                    <div className={styles.statHeader} style={{ marginBottom: '0.75rem' }}>
                        <span className={styles.statTitle}>Total Orders Placed</span>
                        <div className={styles.statIcon} style={{ width: '36px', height: '36px', background: 'rgba(168, 85, 247, 0.15)', color: '#c084fc', borderColor: 'rgba(168, 85, 247, 0.3)' }}>
                            <ShoppingBag size={18} />
                        </div>
                    </div>
                    <div>
                        <div className={styles.statVal} style={{ fontSize: '1.8rem' }}>{data.kpis.totalOrders}</div>
                        <span style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '0.35rem', display: 'block' }}>
                            Customer Checkouts
                        </span>
                    </div>
                </div>

                <div className={styles.statCard} style={{ padding: '1.25rem 1.5rem' }}>
                    <div className={styles.statHeader} style={{ marginBottom: '0.75rem' }}>
                        <span className={styles.statTitle}>Returned Parcels</span>
                        <div className={styles.statIcon} style={{ width: '36px', height: '36px', background: 'rgba(236, 72, 153, 0.15)', color: '#f472b6', borderColor: 'rgba(236, 72, 153, 0.3)' }}>
                            <RotateCcw size={18} />
                        </div>
                    </div>
                    <div>
                        <div className={styles.statVal} style={{ fontSize: '1.8rem', color: '#f472b6' }}>
                            {data.kpis.returnedOrders} <span style={{ fontSize: '0.85rem', fontWeight: 400, color: '#a1a1aa' }}>parcels</span>
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#f472b6', marginTop: '0.35rem', display: 'block' }}>
                            Rs. {data.kpis.returnedValue.toLocaleString()} Returned
                        </span>
                    </div>
                </div>

                <div className={styles.statCard} style={{ padding: '1.25rem 1.5rem' }}>
                    <div className={styles.statHeader} style={{ marginBottom: '0.75rem' }}>
                        <span className={styles.statTitle}>Average Order Value</span>
                        <div className={styles.statIcon} style={{ width: '36px', height: '36px', background: 'rgba(245, 158, 11, 0.15)', color: '#fbbf24', borderColor: 'rgba(245, 158, 11, 0.3)' }}>
                            <BarChart2 size={18} />
                        </div>
                    </div>
                    <div>
                        <div className={styles.statVal} style={{ fontSize: '1.8rem', color: '#fbbf24' }}>
                            Rs. {data.kpis.averageOrderValue.toLocaleString()}
                        </div>
                        <span style={{ fontSize: '0.72rem', color: '#a1a1aa', marginTop: '0.35rem', display: 'block' }}>
                            Average per Transaction
                        </span>
                    </div>
                </div>
            </div>

            {/* Logistics Status Breakdown Bar (5 Clean Compact Blocks) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
                <div style={{ background: '#121215', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <CheckCircle2 size={22} style={{ color: '#34d399', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{data.kpis.deliveredOrders}</div>
                        <div style={{ fontSize: '0.7rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Delivered Parcels</div>
                    </div>
                </div>

                <div style={{ background: '#121215', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <ShoppingBag size={22} style={{ color: '#fbbf24', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{data.kpis.pendingOrders}</div>
                        <div style={{ fontSize: '0.7rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Processing / Shipped</div>
                    </div>
                </div>

                <div style={{ background: '#121215', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <RotateCcw size={22} style={{ color: '#f472b6', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{data.kpis.returnedOrders}</div>
                        <div style={{ fontSize: '0.7rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Returned Parcels</div>
                    </div>
                </div>

                <div style={{ background: '#121215', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <RefreshCw size={22} style={{ color: '#60a5fa', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{data.kpis.refundedOrders}</div>
                        <div style={{ fontSize: '0.7rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Refunded Payments</div>
                    </div>
                </div>

                <div style={{ background: '#121215', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '1.1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                    <XCircle size={22} style={{ color: '#f87171', flexShrink: 0 }} />
                    <div>
                        <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>{data.kpis.cancelledOrders}</div>
                        <div style={{ fontSize: '0.7rem', color: '#a1a1aa', textTransform: 'uppercase', letterSpacing: '1px' }}>Cancelled Orders</div>
                    </div>
                </div>
            </div>

            {/* Primary Revenue Graph Section */}
            <div style={{ background: '#121215', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2.5rem', marginBottom: '2.5rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <div>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.4rem', letterSpacing: '1px' }}>
                            {viewMode === 'monthly' ? '2026 Monthly Sales & Dispatch Analytics' : 'Multi-Year Sales Progression'}
                        </h3>
                        <p style={{ fontSize: '0.85rem', color: '#a1a1aa', marginTop: '0.25rem' }}>
                            Real-time order calculations directly queried from Neon Cloud DB.
                        </p>
                    </div>
                </div>

                {viewMode === 'monthly' ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '1rem', alignItems: 'flex-end', height: '260px', paddingTop: '2rem', borderBottom: '1px solid rgba(255, 255, 255, 0.08)' }}>
                        {data.monthlySales.map((item, idx) => {
                            const barHeight = item.revenue > 0 ? Math.max((item.revenue / maxMonthlyRevenue) * 100, 8) : 4;
                            const isZero = item.revenue === 0;
                            return (
                                <div key={idx} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' }}>
                                    <div style={{ fontSize: '0.7rem', color: isZero ? '#52525b' : '#60a5fa', marginBottom: '0.5rem', fontWeight: 600, textAlign: 'center' }}>
                                        {item.revenue > 0 ? `Rs.${(item.revenue / 1000).toFixed(1)}k` : '-'}
                                    </div>
                                    <div 
                                        style={{ 
                                            width: '100%', 
                                            maxWidth: '36px',
                                            height: `${barHeight}%`, 
                                            background: isZero ? 'rgba(255, 255, 255, 0.04)' : 'linear-gradient(180deg, #60a5fa, #1d4ed8)', 
                                            borderRadius: '6px 6px 0 0',
                                            boxShadow: isZero ? 'none' : '0 0 15px rgba(59, 130, 246, 0.3)',
                                            transition: 'all 0.3s ease',
                                            cursor: 'pointer'
                                        }}
                                        title={`${item.month}: Rs. ${item.revenue.toLocaleString()} (${item.orders} orders placed, ${item.returned} returned)`}
                                    />
                                    <div style={{ marginTop: '0.75rem', fontSize: '0.8rem', color: '#a1a1aa', fontWeight: 500 }}>
                                        {item.month}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', paddingTop: '1rem' }}>
                        {data.yearlySales.length === 0 ? (
                            <p style={{ color: '#a1a1aa' }}>No multi-year records available in database.</p>
                        ) : (
                            data.yearlySales.map((y, idx) => {
                                const fillWidth = Math.max((y.revenue / maxYearlyRevenue) * 100, 5);
                                return (
                                    <div key={idx}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                                            <span style={{ fontWeight: 700, color: '#ffffff' }}>Year {y.year}</span>
                                            <span style={{ color: '#60a5fa', fontWeight: 600 }}>Rs. {y.revenue.toLocaleString()} ({y.orders} active orders)</span>
                                        </div>
                                        <div style={{ width: '100%', height: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '6px', overflow: 'hidden' }}>
                                            <div style={{ width: `${fillWidth}%`, height: '100%', background: 'linear-gradient(90deg, #3b82f6, #60a5fa)', borderRadius: '6px', boxShadow: '0 0 10px rgba(59, 130, 246, 0.4)' }} />
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}
            </div>

            {/* Grid: Category Breakdown & Top Products */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2.5rem' }}>
                {/* Revenue by Category */}
                <div style={{ background: '#121215', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <PieChart size={20} style={{ color: '#60a5fa' }} />
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', letterSpacing: '1px' }}>Category Sales Shares</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {data.categorySales.length === 0 ? (
                            <p style={{ color: '#a1a1aa' }}>No category transactions recorded yet.</p>
                        ) : (
                            data.categorySales.map((cat, idx) => (
                                <div key={idx}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.4rem' }}>
                                        <span style={{ color: '#ffffff', fontWeight: 500 }}>{cat.category}</span>
                                        <span style={{ color: '#a1a1aa' }}>Rs. {cat.revenue.toLocaleString()} ({cat.percentage}%)</span>
                                    </div>
                                    <div style={{ width: '100%', height: '8px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <div style={{ width: `${cat.percentage}%`, height: '100%', background: 'linear-gradient(90deg, #c084fc, #3b82f6)', borderRadius: '4px' }} />
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Top Best Selling Products */}
                <div style={{ background: '#121215', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '2rem', boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1.5rem' }}>
                        <Award size={20} style={{ color: '#fbbf24' }} />
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.25rem', letterSpacing: '1px' }}>Top 5 Best Selling Perfumes</h3>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {data.topProducts.length === 0 ? (
                            <p style={{ color: '#a1a1aa' }}>No product sales recorded yet.</p>
                        ) : (
                            data.topProducts.map((prod, idx) => (
                                <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255, 255, 255, 0.02)', padding: '0.85rem 1rem', borderRadius: '8px', border: '1px solid rgba(255, 255, 255, 0.04)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                                        <div style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.9rem', width: '20px' }}>#{idx + 1}</div>
                                        <img src={prod.image} alt={prod.name} style={{ width: '38px', height: '38px', objectFit: 'cover', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }} />
                                        <div>
                                            <div style={{ fontWeight: 600, color: '#ffffff', fontSize: '0.9rem' }}>{prod.name}</div>
                                            <div style={{ fontSize: '0.75rem', color: '#a1a1aa' }}>{prod.qty} units sold</div>
                                        </div>
                                    </div>
                                    <div style={{ textAlign: 'right', fontWeight: 700, color: '#60a5fa', fontSize: '0.9rem' }}>
                                        Rs. {prod.revenue.toLocaleString()}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
