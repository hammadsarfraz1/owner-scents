'use client';

import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { CheckCircle2, Package, Truck, ShieldCheck, ArrowRight, MessageSquare } from 'lucide-react';

type OrderItem = {
    id: string;
    quantity: number;
    price: string | number;
    product: {
        id: string;
        name: string;
        image: string;
        homepageImage?: string;
        category?: string;
        gender?: string;
    };
};

type OrderDetails = {
    id: string;
    shippingName: string;
    shippingAddress: string;
    city: string;
    country: string;
    phoneNumber: string;
    email?: string;
    total: string | number;
    paymentMethod: string;
    paymentStatus: string;
    status: string;
    createdAt: string;
    items: OrderItem[];
};

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const [order, setOrder] = useState<OrderDetails | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!orderId) {
            setLoading(false);
            return;
        }

        fetch(`/api/orders/${orderId}`)
            .then(res => {
                if (res.ok) return res.json();
                throw new Error('Order not found');
            })
            .then(data => {
                setOrder(data);
            })
            .catch(err => console.error('Error loading order details:', err))
            .finally(() => setLoading(false));
    }, [orderId]);

    return (
        <div className={styles.container}>
            {/* Header Success Icon */}
            <div className={styles.badgeWrapper}>
                <div className={styles.iconRing}>
                    <CheckCircle2 className={styles.checkIcon} size={44} />
                </div>
            </div>

            <h1 className={styles.title}>Order Confirmed</h1>
            <p className={styles.subtitle}>
                Thank you for choosing Owner Scents. We are preparing your artisanal fragrance experience with utmost care.
            </p>

            {loading ? (
                <div className={styles.loadingBox}>
                    <div className={styles.spinner} />
                    <span>Loading your order summary...</span>
                </div>
            ) : order ? (
                <div className={styles.orderCard}>
                    <div className={styles.cardHeader}>
                        <div className={styles.headerTitleGroup}>
                            <Package size={20} className={styles.headerIcon} />
                            <h2>Ordered Fragrances</h2>
                        </div>
                        <span className={styles.refBadge}>Ref #{order.id.slice(-8).toUpperCase()}</span>
                    </div>

                    {/* Product List */}
                    <div className={styles.itemsList}>
                        {order.items.map((item) => {
                            const prodImage = item.product?.homepageImage || item.product?.image || '/placeholder.png';
                            const unitPrice = Number(item.price);
                            const totalPrice = unitPrice * item.quantity;

                            return (
                                <div key={item.id} className={styles.itemRow}>
                                    <div className={styles.itemImgWrapper}>
                                        <img src={prodImage} alt={item.product?.name || 'Fragrance'} className={styles.itemImg} />
                                    </div>
                                    <div className={styles.itemDetails}>
                                        <h3 className={styles.itemName}>{item.product?.name || 'Luxury Fragrance'}</h3>
                                        <div className={styles.itemMeta}>
                                            {item.product?.gender && <span className={styles.tag}>{item.product.gender}</span>}
                                            {item.product?.category && <span className={styles.tag}>{item.product.category}</span>}
                                        </div>
                                        <span className={styles.itemQty}>Qty: {item.quantity} × Rs. {unitPrice.toLocaleString()}</span>
                                    </div>
                                    <div className={styles.itemPrice}>
                                        Rs. {totalPrice.toLocaleString()}
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Summary Footer */}
                    <div className={styles.cardFooter}>
                        <div className={styles.shippingSummary}>
                            <div className={styles.summaryBlock}>
                                <div className={styles.blockHeader}>
                                    <Truck size={16} />
                                    <span>Shipping Destination</span>
                                </div>
                                <p className={styles.blockText}>
                                    <strong>{order.shippingName}</strong><br />
                                    {order.shippingAddress}, {order.city}<br />
                                    Phone: {order.phoneNumber}
                                </p>
                            </div>
                            <div className={styles.summaryBlock}>
                                <div className={styles.blockHeader}>
                                    <ShieldCheck size={16} />
                                    <span>Payment Details</span>
                                </div>
                                <p className={styles.blockText}>
                                    Method: <strong>{order.paymentMethod === 'CARD' ? 'Credit / Debit Card' : 'Cash on Delivery (COD)'}</strong><br />
                                    Status: <span className={order.paymentStatus === 'PAID' ? styles.statusPaid : styles.statusPending}>{order.paymentStatus}</span>
                                </p>
                            </div>
                        </div>

                        <div className={styles.totalRow}>
                            <span className={styles.totalLabel}>Grand Total</span>
                            <span className={styles.totalValue}>Rs. {Number(order.total).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className={styles.fallbackMsg}>
                    Order details received. Reference ID: <span className={styles.orderId}>{orderId || 'N/A'}</span>
                </div>
            )}

            <div className={styles.infoBanner}>
                <p>Our concierge rider will contact you prior to delivery. You will also receive dispatch updates via phone/email.</p>
            </div>

            <div className={styles.actionGroup}>
                <Link href="/shop" className={styles.primaryBtn}>
                    Explore More Scents <ArrowRight size={16} />
                </Link>
                <a 
                    href="https://wa.me/923001234567?text=Hello!%20I%20have%20a%20question%20regarding%20my%20recent%20order." 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className={styles.secondaryBtn}
                >
                    <MessageSquare size={16} /> Contact Support
                </a>
            </div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
            <Navbar />
            <Suspense fallback={<div className={styles.loadingFull}>Loading Order Confirmation...</div>}>
                <SuccessContent />
            </Suspense>
            <Footer />
        </div>
    );
}
