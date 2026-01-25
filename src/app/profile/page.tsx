'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './profile.module.css';

type Order = {
    id: string;
    createdAt: string;
    total: string;
    status: string;
    items: {
        product: {
            name: string;
            image: string;
        };
        quantity: number;
        price: string;
    }[];
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
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (status === 'loading' || loading) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Loading...</div>;
    }

    if (!session) return null;

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Welcome, {session.user?.name}</h1>
                    <p className={styles.email}>{session.user?.email}</p>
                </div>

                <div className={styles.section}>
                    <h2 className={styles.sectionTitle}>My Orders</h2>

                    {orders.length === 0 ? (
                        <p>You haven't placed any orders yet.</p>
                    ) : (
                        <div className={styles.ordersGrid}>
                            {orders.map(order => (
                                <div key={order.id} className={styles.orderCard}>
                                    <div className={styles.minHeader}>
                                        <span className={styles.date}>{new Date(order.createdAt).toLocaleDateString()}</span>
                                        <span className={`${styles.status} ${styles[order.status.toLowerCase()]}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                    <div className={styles.items}>
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className={styles.itemRow}>
                                                <span>{item.quantity}x {item.product.name}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className={styles.totalRow}>
                                        <span>Total</span>
                                        <span className={styles.totalPrice}>${Number(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
