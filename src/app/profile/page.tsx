'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './profile.module.css';
import Link from 'next/link';
import { 
    Package, 
    Calendar, 
    MapPin, 
    CreditCard, 
    CheckCircle2, 
    ShoppingBag, 
    ArrowRight, 
    Truck, 
    Star, 
    ChevronDown, 
    ChevronUp, 
    Gift, 
    X,
    MessageSquare
} from 'lucide-react';

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

    // Tracking expansion state
    const [expandedTrackOrderId, setExpandedTrackOrderId] = useState<string | null>(null);

    // Review Modal state
    const [reviewProduct, setReviewProduct] = useState<{ id: string; name: string } | null>(null);
    const [reviewRating, setReviewRating] = useState(5);
    const [reviewComment, setReviewComment] = useState('');
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewSuccess, setReviewSuccess] = useState('');
    const [reviewError, setReviewError] = useState('');

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

    const toggleTrack = (orderId: string) => {
        setExpandedTrackOrderId(prev => prev === orderId ? null : orderId);
    };

    const handleOpenReview = (productId?: string, productName?: string) => {
        if (!productId || !productName) return;
        setReviewProduct({ id: productId, name: productName });
        setReviewRating(5);
        setReviewComment('');
        setReviewSuccess('');
        setReviewError('');
    };

    const handleSubmitReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!reviewProduct) return;
        setReviewSubmitting(true);
        setReviewError('');
        setReviewSuccess('');

        try {
            const res = await fetch(`/api/products/${reviewProduct.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: session?.user?.name || 'Fragrance Connoisseur',
                    rating: reviewRating,
                    comment: reviewComment
                })
            });

            if (res.ok) {
                setReviewSuccess('Thank you! Your artisanal review has been published.');
                setTimeout(() => {
                    setReviewProduct(null);
                }, 2000);
            } else {
                const data = await res.json();
                setReviewError(data.error || 'Failed to submit review');
            }
        } catch (err) {
            console.error(err);
            setReviewError('Error submitting review due to network issue.');
        } finally {
            setReviewSubmitting(false);
        }
    };

    const getTrackingSteps = (orderStatusStr: string) => {
        const s = orderStatusStr.toUpperCase();
        let stepNum = 1;
        if (s === 'PACKED') stepNum = 2;
        else if (s === 'SHIPPED') stepNum = 3;
        else if (s === 'DELIVERED') stepNum = 4;
        else if (s === 'CANCELLED') stepNum = -1;

        return [
            { step: 1, key: 'ORDERED', title: 'Ordered', desc: 'Order Placed', icon: CheckCircle2 },
            { step: 2, key: 'PACKED', title: 'Packed', desc: 'Artisanal Packaging', icon: Gift },
            { step: 3, key: 'SHIPPED', title: 'Shipped', desc: 'Rider Dispatched', icon: Truck },
            { step: 4, key: 'DELIVERED', title: 'Delivered', desc: 'Order Delivered', icon: MapPin },
            { step: 5, key: 'REVIEW', title: 'Review', desc: 'Rate Fragrance', icon: Star },
        ].map(st => ({
            ...st,
            isCompleted: stepNum >= st.step,
            isCurrent: stepNum === st.step,
            isReviewAvailable: st.step === 5 && stepNum === 4
        }));
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
                            <h2 className={styles.sectionTitle}>Order History & Tracking</h2>
                        </div>
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
                                const isTrackingOpen = expandedTrackOrderId === order.id || order.status.toUpperCase() === 'SHIPPED';
                                const trackingSteps = getTrackingSteps(order.status);
                                const isDelivered = orderStatus === 'DELIVERED';

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
                                            <button 
                                                className={styles.trackToggleBtn}
                                                onClick={() => toggleTrack(order.id)}
                                            >
                                                <Truck size={15} />
                                                <span>{isTrackingOpen ? 'Hide Tracking' : 'Track Order'}</span>
                                                {isTrackingOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                            </button>
                                        </div>

                                        {/* Advanced 5-Step Order Tracking Section */}
                                        {isTrackingOpen && (
                                            <div className={styles.trackingContainer}>
                                                <div className={styles.trackingHeader}>
                                                    <span>Live Fulfillment Tracker</span>
                                                </div>
                                                <div className={styles.trackerTimeline}>
                                                    {trackingSteps.map((st) => {
                                                        const IconComponent = st.icon;
                                                        return (
                                                            <div 
                                                                key={st.step} 
                                                                className={`${styles.stepBox} ${st.isCompleted ? styles.stepCompleted : ''} ${st.isCurrent ? styles.stepCurrent : ''}`}
                                                            >
                                                                <div className={styles.stepIconWrapper}>
                                                                    <IconComponent size={18} />
                                                                </div>
                                                                <div className={styles.stepTextGroup}>
                                                                    <span className={styles.stepTitle}>{st.title}</span>
                                                                    <span className={styles.stepDesc}>{st.desc}</span>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        )}

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

                                                        <div className={styles.itemRightCol}>
                                                            <div className={styles.itemSubtotal}>
                                                                Rs. {itemTotal.toLocaleString()}
                                                            </div>
                                                            {isDelivered && item.product?.id && (
                                                                <button 
                                                                    className={styles.writeReviewBtn}
                                                                    onClick={() => handleOpenReview(item.product.id, item.product.name)}
                                                                >
                                                                    <Star size={12} fill="currentColor" /> Write Review
                                                                </button>
                                                            )}
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

            {/* Review Modal Popup */}
            {reviewProduct && (
                <div className={styles.modalOverlay} onClick={() => setReviewProduct(null)}>
                    <div className={styles.reviewModal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>Review {reviewProduct.name}</h3>
                            <button onClick={() => setReviewProduct(null)} className={styles.closeModalBtn}>
                                <X size={18} />
                            </button>
                        </div>

                        {reviewSuccess ? (
                            <div className={styles.successMsg}>
                                <CheckCircle2 size={36} color="#34d399" />
                                <p>{reviewSuccess}</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmitReview} className={styles.reviewForm}>
                                {reviewError && <div className={styles.errorMsg}>{reviewError}</div>}
                                
                                <div className={styles.ratingGroup}>
                                    <label>Rating</label>
                                    <div className={styles.starsRow}>
                                        {[1, 2, 3, 4, 5].map(star => (
                                            <button
                                                type="button"
                                                key={star}
                                                className={`${styles.starBtn} ${star <= reviewRating ? styles.starActive : ''}`}
                                                onClick={() => setReviewRating(star)}
                                            >
                                                ★
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className={styles.formGroup}>
                                    <label>Your Fragrance Appraisal</label>
                                    <textarea
                                        rows={4}
                                        value={reviewComment}
                                        onChange={(e) => setReviewComment(e.target.value)}
                                        placeholder="Share your olfactory experience with scent lovers..."
                                        required
                                        className={styles.textarea}
                                    />
                                </div>

                                <button type="submit" className={styles.submitReviewBtn} disabled={reviewSubmitting}>
                                    {reviewSubmitting ? 'Publishing Review...' : 'Submit Review'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            )}

            <Footer />
        </div>
    );
}
