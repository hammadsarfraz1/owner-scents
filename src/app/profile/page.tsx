'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './profile.module.css';
import Link from 'next/link';
import { Package, Calendar, MapPin, CreditCard, Clock, CheckCircle2, ShoppingBag, ArrowRight } from 'lucide-react';

type OrderItem = {
    id?: string;
    quantity: number;
    price: string | number;
    product: {
        id?: string;
        name: string;
        image: string;
        homepageImage?: string;
        gender?: string;
        category?: string;
    };
};

type Order = {
    id: string;
    createdAt: string;
    total: string | number;
    status: string;
    paymentMethod?: string;
    paymentStatus?: string;
    shippingName?: string;
    shippingAddress?: string;
    city?: string;
    items: OrderItem[];
};

export default function ProfilePage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        } else if (status === 'authenticated') {
            fetchOrders();
        }
    }, [status]);

    const fetchOrders = async () => {
        try {
            const res = await fetch('/api/user/orders');
            if (res.ok) {
                const data = await res.json();
                setOrders(data);
            }
        } catch (error) {
            console.error('Error fetching profile orders:', error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className={styles.loadingContainer}>
                <div className={styles.spinner} />
                <span>Loading your profile...</span>
            </div>
        );
    }

    if (!session) return null;

    const userName = session.user?.name || 'Valued Client';
    const userInitial = userName.charAt(0).toUpperCase();

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                {/* Profile Banner */}
                <div className={styles.profileHeaderCard}>
                    <div className={styles.avatarCircle}>
                        {userInitial}
                    </div>
                    <div className={styles.profileInfo}>
                        <span className={styles.memberBadge}>VIP CONNOISSEUR</span>
                        <h1 className={styles.userName}>{userName}</h1>
                        <p className={styles.userEmail}>{session.user?.email}</p>
                    </div>
                    <div className={styles.profileStats}>
                        <div className={styles.statBox}>
                            <span className={styles.statVal}>{orders.length}</span>
                            <span className={styles.statLbl}>Total Orders</span>
                        </div>
                    </div>
                </div>

                {/* Orders Section */}
                <div className={styles.section}>
                    <div className={styles.sectionHeader}>
                        <div className={styles.titleGroup}>
                            <Package size={22} className={styles.titleIcon} />
                            <h2 className={styles.sectionTitle}>Order History</h2>
                        </div>
                        <span className={styles.orderCountBadge}>{orders.length} {orders.length === 1 ? 'Record' : 'Records'}</span>
                    </div>

                    {orders.length === 0 ? (
                        <div className={styles.emptyOrdersCard}>
                            <ShoppingBag size={48} className={styles.emptyIcon} />
                            <h3>No Orders Found</h3>
                            <p>You haven't experienced our artisanal fragrance collections yet.</p>
                            <Link href="/shop" className={styles.exploreBtn}>
                                Explore Catalog <ArrowRight size={16} />
                            </Link>
                        </div>
                    ) : (
                        <div className={styles.ordersList}>
                            {orders.map(order => {
                                const formattedDate = new Date(order.createdAt).toLocaleDateString('en-US', {
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                });
                                const orderStatus = order.status.toUpperCase();
                                const statusClass = order.status.toLowerCase();

                                return (
                                    <div key={order.id} className={styles.orderCard}>
                                        {/* Card Top Header */}
                                        <div className={styles.cardTopHeader}>
                                            <div className={styles.refGroup}>
                                                <span className={styles.refLabel}>ORDER</span>
                                                <span className={styles.refVal}>#{order.id.slice(-8).toUpperCase()}</span>
                                            </div>
                                            <div className={styles.dateGroup}>
                                                <Calendar size={14} />
                                                <span>{formattedDate}</span>
                                            </div>
                                            <div className={`${styles.statusBadge} ${styles[statusClass] || styles.pending}`}>
                                                <span className={styles.statusDot} />
                                                {orderStatus}
                                            </div>
                                        </div>

                                        {/* Items List */}
                                        <div className={styles.cardItems}>
                                            {order.items.map((item, idx) => {
                                                const prodImg = item.product?.homepageImage || item.product?.image || '/placeholder.png';
                                                const unitPrice = Number(item.price);
                                                const itemTotal = unitPrice * item.quantity;

                                                return (
                                                    <div key={idx} className={styles.itemRow}>
                                                        <div className={styles.itemThumbWrapper}>
                                                            <img src={prodImg} alt={item.product?.name || 'Fragrance'} className={styles.itemThumb} />
                                                        </div>
                                                        <div className={styles.itemMetaCol}>
                                                            <h4 className={styles.itemTitle}>{item.product?.name || 'Custom Fragrance'}</h4>
                                                            <div className={styles.tagsRow}>
                                                                {item.product?.gender && <span className={styles.miniTag}>{item.product.gender}</span>}
                                                                {item.product?.category && <span className={styles.miniTag}>{item.product.category}</span>}
                                                            </div>
                                                            <span className={styles.itemQtyPrice}>Qty: {item.quantity} × Rs. {unitPrice.toLocaleString()}</span>
                                                        </div>
                                                        <div className={styles.itemSubtotal}>
                                                            Rs. {itemTotal.toLocaleString()}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Card Bottom Footer */}
                                        <div className={styles.cardBottomFooter}>
                                            <div className={styles.footerLeft}>
                                                {order.shippingAddress && (
                                                    <div className={styles.footerInfoItem}>
                                                        <MapPin size={14} />
                                                        <span>{order.city ? `${order.city}` : 'Delivery Scheduled'}</span>
                                                    </div>
                                                )}
                                                {order.paymentMethod && (
                                                    <div className={styles.footerInfoItem}>
                                                        <CreditCard size={14} />
                                                        <span>{order.paymentMethod === 'CARD' ? 'Paid via Card' : 'Cash on Delivery'}</span>
                                                    </div>
                                                )}
                                            </div>

                                            <div className={styles.footerRight}>
                                                <span className={styles.grandTotalLabel}>Total Amount</span>
                                                <span className={styles.grandTotalVal}>Rs. {Number(order.total).toLocaleString()}</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
