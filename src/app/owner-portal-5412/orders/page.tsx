'use client';

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import styles from '../admin.module.css';

type OrderItem = {
    id: string;
    productId: string;
    quantity: number;
    price: string;
    product: {
        name: string;
        image: string;
        price: string;
    };
};

type Order = {
    id: string;
    createdAt: string;
    total: string;
    status: string;
    paymentMethod: string;
    paymentStatus: string;
    shippingName: string;
    shippingAddress: string;
    city: string;
    postalCode: string;
    country: string;
    phoneNumber: string;
    email: string | null;
    items: OrderItem[];
    user: {
        name: string | null;
    } | null;
};

export default function AdminOrders() {
    const [mounted, setMounted] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        setMounted(true);
    }, []);
    
    // Filtering and search states
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [searchQuery, setSearchQuery] = useState('');
    
    // Modal states
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [updatingStatus, setUpdatingStatus] = useState('');
    const [updatingPayment, setUpdatingPayment] = useState('');
    const [submittingChange, setSubmittingChange] = useState(false);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/orders?t=' + Date.now());
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            } else {
                throw new Error('Failed to fetch orders');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load orders from the database.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const openDetailsModal = (order: Order) => {
        setSelectedOrder(order);
        setUpdatingStatus(order.status);
        setUpdatingPayment(order.paymentStatus);
        setError('');
        setSuccess('');
    };

    const closeDetailsModal = () => {
        setSelectedOrder(null);
    };

    const handleUpdateOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedOrder) return;

        try {
            setSubmittingChange(true);
            setError('');
            setSuccess('');

            const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    status: updatingStatus,
                    paymentStatus: updatingPayment
                })
            });

            if (res.ok) {
                setSuccess('Order updated successfully!');
                // Refresh local state
                setOrders(prev => prev.map(o => o.id === selectedOrder.id ? {
                    ...o,
                    status: updatingStatus,
                    paymentStatus: updatingPayment
                } : o));
                
                // Update selected order in modal
                setSelectedOrder(prev => prev ? {
                    ...prev,
                    status: updatingStatus,
                    paymentStatus: updatingPayment
                } : null);
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to update order');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error updating order.');
        } finally {
            setSubmittingChange(false);
        }
    };

    const handleDeleteOrder = async () => {
        if (!selectedOrder) return;
        const confirmDelete = window.confirm('Are you absolutely sure you want to delete this order? This cannot be undone.');
        if (!confirmDelete) return;

        try {
            setSubmittingChange(true);
            setError('');
            setSuccess('');

            const res = await fetch(`/api/admin/orders/${selectedOrder.id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                alert('Order deleted successfully.');
                setOrders(prev => prev.filter(o => o.id !== selectedOrder.id));
                closeDetailsModal();
            } else {
                const data = await res.json();
                throw new Error(data.error || 'Failed to delete order');
            }
        } catch (err: any) {
            console.error(err);
            setError(err.message || 'Error deleting order.');
            setSubmittingChange(false);
        }
    };

    // Filter and search logic
    const filteredOrders = orders.filter(order => {
        const matchesStatus = statusFilter === 'ALL' || order.status === statusFilter;
        
        const idQuery = order.id.toLowerCase();
        const nameQuery = order.shippingName.toLowerCase();
        const cityQuery = order.city.toLowerCase();
        const phoneQuery = order.phoneNumber.toLowerCase();
        const q = searchQuery.toLowerCase().trim();
        
        const matchesSearch = !q || 
            idQuery.includes(q) || 
            nameQuery.includes(q) || 
            cityQuery.includes(q) || 
            phoneQuery.includes(q);

        return matchesStatus && matchesSearch;
    });

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'DELIVERED':
                return { color: '#10b981', background: '#10b98115', border: '1px solid #10b98140' };
            case 'SHIPPED':
                return { color: '#a855f7', background: '#a855f715', border: '1px solid #a855f740' };
            case 'PACKED':
                return { color: '#3b82f6', background: '#3b82f615', border: '1px solid #3b82f640' };
            case 'CANCELLED':
                return { color: '#ef4444', background: '#ef444415', border: '1px solid #ef444440' };
            case 'ORDERED':
            case 'PENDING':
            default:
                return { color: '#e5bf48', background: '#e5bf4815', border: '1px solid #e5bf4840' };
        }
    };

    const getPaymentStatusStyle = (status: string) => {
        switch (status) {
            case 'PAID':
                return { color: '#10b981', background: '#10b98110', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' };
            case 'REFUNDED':
                return { color: '#3b82f6', background: '#3b82f610', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' };
            case 'PENDING':
            default:
                return { color: '#e5bf48', background: '#e5bf4810', padding: '2px 8px', borderRadius: '4px', fontSize: '0.85rem' };
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Orders Database...</div>;

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '1.5rem' }}>Orders Administration</h1>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2rem', background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                {/* Status Filter Tabs */}
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {['ALL', 'PENDING', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setStatusFilter(status)}
                            className={statusFilter === status ? styles.btnPrimary : styles.btnSecondary}
                            style={{ padding: '0.5rem 1rem', fontSize: '0.75rem' }}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Search Input */}
                <div style={{ position: 'relative', width: '100%', maxWidth: '300px' }}>
                    <input
                        type="text"
                        placeholder="Search by customer, city, ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.input}
                        style={{ width: '100%', paddingLeft: '1rem' }}
                    />
                </div>
            </div>

            {/* Orders Table */}
            {filteredOrders.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No orders matching the criteria were found.</p>
                </div>
            ) : (
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Order ID</th>
                                <th className={styles.th}>Customer</th>
                                <th className={styles.th}>Location</th>
                                <th className={styles.th}>Date</th>
                                <th className={styles.th}>Total</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((order) => {
                                const statusStyle = getStatusStyle(order.status);
                                return (
                                    <tr key={order.id} className={styles.tr}>
                                        <td className={styles.td} style={{ fontWeight: '600', fontFamily: 'monospace' }}>
                                            #{order.id.slice(-8).toUpperCase()}
                                        </td>
                                        <td className={styles.td}>
                                            <div style={{ fontWeight: '500' }}>{order.shippingName}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{order.phoneNumber}</div>
                                        </td>
                                        <td className={styles.td}>
                                            <div>{order.city}</div>
                                            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{order.shippingAddress}</div>
                                        </td>
                                        <td className={styles.td}>
                                            {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                                        </td>
                                        <td className={styles.td} style={{ fontWeight: '700', color: 'var(--accent)' }}>
                                            Rs. {Number(order.total).toLocaleString()}
                                        </td>
                                        <td className={styles.td}>
                                            <span style={{ 
                                                display: 'inline-block',
                                                padding: '4px 10px', 
                                                borderRadius: '20px', 
                                                fontSize: '0.75rem', 
                                                fontWeight: '600',
                                                letterSpacing: '0.5px',
                                                ...statusStyle 
                                            }}>
                                                {order.status}
                                            </span>
                                        </td>
                                        <td className={styles.td} style={{ textAlign: 'right' }}>
                                            <button 
                                                onClick={() => openDetailsModal(order)}
                                                className={styles.btnSecondary}
                                                style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                            >
                                                Manage
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Details & Management Modal */}
            {mounted && selectedOrder && createPortal(
                <div className={styles.modalOverlay} onClick={closeDetailsModal}>
                    <div className={styles.modalContent} onClick={(e) => e.stopPropagation()} style={{ maxWidth: '800px' }}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Manage Order #{selectedOrder.id.slice(-8).toUpperCase()}</h2>
                            <button className={styles.modalClose} onClick={closeDetailsModal}>&times;</button>
                        </div>

                        {error && <div style={{ color: '#ef4444', background: '#ef44440d', padding: '1rem', border: '1px solid #ef4444', marginBottom: '1.5rem', borderRadius: '4px' }}>{error}</div>}
                        {success && <div style={{ color: '#10b981', background: '#10b9810d', padding: '1rem', border: '1px solid #10b981', marginBottom: '1.5rem', borderRadius: '4px' }}>{success}</div>}

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
                            {/* Shipping info */}
                            <div>
                                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '1px', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Shipping Information</h3>
                                <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)', width: '120px' }}>Name:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: '500' }}>{selectedOrder.shippingName}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Phone:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: '500' }}>{selectedOrder.phoneNumber}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Email:</td>
                                            <td style={{ padding: '0.5rem 0' }}>{selectedOrder.email || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Address:</td>
                                            <td style={{ padding: '0.5rem 0', lineHeight: '1.4' }}>{selectedOrder.shippingAddress}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>City:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: '500' }}>{selectedOrder.city}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Postal Code:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: '500' }}>{selectedOrder.postalCode || 'N/A'}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Country:</td>
                                            <td style={{ padding: '0.5rem 0' }}>{selectedOrder.country}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>

                            {/* Order Details & Actions */}
                            <div>
                                <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '1px', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Order Details</h3>
                                <table style={{ width: '100%', fontSize: '0.9rem', borderCollapse: 'collapse', marginBottom: '1.5rem' }}>
                                    <tbody>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)', width: '140px' }}>Order Ref:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: '700', color: 'var(--accent)' }}>
                                                #{selectedOrder.id.slice(-8).toUpperCase()}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Full System ID:</td>
                                            <td style={{ padding: '0.5rem 0', fontSize: '0.75rem', fontFamily: 'monospace', color: 'var(--text-secondary)' }}>
                                                {selectedOrder.id}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Placed On:</td>
                                            <td style={{ padding: '0.5rem 0' }}>
                                                {new Date(selectedOrder.createdAt).toLocaleString('en-GB')}
                                            </td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Payment Method:</td>
                                            <td style={{ padding: '0.5rem 0', fontWeight: '600' }}>{selectedOrder.paymentMethod}</td>
                                        </tr>
                                        <tr>
                                            <td style={{ padding: '0.5rem 0', color: 'var(--text-secondary)' }}>Payment Status:</td>
                                            <td style={{ padding: '0.5rem 0' }}>
                                                <span style={getPaymentStatusStyle(selectedOrder.paymentStatus)}>
                                                    {selectedOrder.paymentStatus}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>

                                {/* Update Form */}
                                <form onSubmit={handleUpdateOrder} style={{ background: 'var(--bg-primary)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                    <h4 style={{ fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '1rem', letterSpacing: '0.5px' }}>Status Update</h4>
                                    
                                    <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                                        <label className={styles.label}>Fulfillment Status</label>
                                        <select 
                                            value={updatingStatus} 
                                            onChange={(e) => setUpdatingStatus(e.target.value)}
                                            className={styles.select}
                                        >
                                            <option value="PENDING">PENDING (ORDERED)</option>
                                            <option value="PACKED">PACKED</option>
                                            <option value="SHIPPED">SHIPPED</option>
                                            <option value="DELIVERED">DELIVERED</option>
                                            <option value="CANCELLED">CANCELLED</option>
                                        </select>
                                    </div>

                                    <div className={styles.formGroup} style={{ marginBottom: '1.25rem' }}>
                                        <label className={styles.label}>Payment Status</label>
                                        <select 
                                            value={updatingPayment} 
                                            onChange={(e) => setUpdatingPayment(e.target.value)}
                                            className={styles.select}
                                        >
                                            <option value="PENDING">PENDING</option>
                                            <option value="PAID">PAID</option>
                                            <option value="REFUNDED">REFUNDED</option>
                                        </select>
                                    </div>

                                    <button 
                                        type="submit" 
                                        className={styles.btnPrimary} 
                                        style={{ width: '100%' }}
                                        disabled={submittingChange}
                                    >
                                        {submittingChange ? 'Saving Changes...' : 'Save Fulfillment Updates'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        {/* Order Items Table */}
                        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', color: 'var(--accent)', letterSpacing: '1px', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Ordered Items</h3>
                        <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden', marginBottom: '2rem' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-tertiary)', borderBottom: '1px solid var(--border-color)', fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                                        <th style={{ padding: '0.75rem 1rem' }}>Product</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'center' }}>Qty</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Price</th>
                                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedOrder.items.map((item) => {
                                        // Fallback to product model price if orderItem price is 0
                                        const finalPrice = Number(item.price) > 0 ? Number(item.price) : Number(item.product.price);
                                        return (
                                            <tr key={item.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                                <td style={{ padding: '0.75rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                                    <img 
                                                        src={item.product.image} 
                                                        alt={item.product.name} 
                                                        style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }}
                                                    />
                                                    <span style={{ fontWeight: '500', fontSize: '0.9rem' }}>{item.product.name}</span>
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', textAlign: 'center', fontSize: '0.9rem' }}>
                                                    {item.quantity}
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontSize: '0.9rem' }}>
                                                    Rs. {finalPrice.toLocaleString()}
                                                </td>
                                                <td style={{ padding: '0.75rem 1rem', textAlign: 'right', fontWeight: '600', fontSize: '0.9rem' }}>
                                                    Rs. {(finalPrice * item.quantity).toLocaleString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>

                        {/* Summary Block */}
                        <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem', marginBottom: '1.5rem' }}>
                            <div style={{ width: '100%', maxWidth: '280px', fontSize: '0.95rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Items Subtotal:</span>
                                    <span>
                                        Rs. {selectedOrder.items.reduce((sum, item) => {
                                            const finalPrice = Number(item.price) > 0 ? Number(item.price) : Number(item.product.price);
                                            return sum + (finalPrice * item.quantity);
                                        }, 0).toLocaleString()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border-color)' }}>
                                    <span style={{ color: 'var(--text-secondary)' }}>Shipping Charge:</span>
                                    <span>
                                        {/* Calculate shipping as difference or fallback */}
                                        {(() => {
                                            const subtotal = selectedOrder.items.reduce((sum, item) => {
                                                const finalPrice = Number(item.price) > 0 ? Number(item.price) : Number(item.product.price);
                                                return sum + (finalPrice * item.quantity);
                                            }, 0);
                                            const diff = Number(selectedOrder.total) - subtotal;
                                            return diff > 0 ? `Rs. ${diff.toLocaleString()}` : 'FREE';
                                        })()}
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: '700' }}>
                                    <span>Grand Total:</span>
                                    <span style={{ color: 'var(--accent)' }}>Rs. {Number(selectedOrder.total).toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Modal Actions */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                            <button 
                                onClick={handleDeleteOrder} 
                                className={styles.btnDanger}
                                disabled={submittingChange}
                            >
                                {submittingChange ? 'Deleting...' : 'Delete Order'}
                            </button>
                            <button 
                                onClick={closeDetailsModal} 
                                className={styles.btnSecondary}
                                style={{ minWidth: '100px' }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>,
                document.body
            )}
        </div>
    );
}
