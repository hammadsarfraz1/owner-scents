'use client';

import { useSearchParams } from 'next/navigation';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import Link from 'next/link';
import { Suspense } from 'react';

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className={styles.container}>
            <div className={styles.icon}>✓</div>
            <h1 className={styles.title}>Order Confirmed</h1>
            <p className={styles.message}>
                Thank you for your purchase. Your order <span className={styles.orderId}>{orderId || 'Unknown'}</span> has been received.
                <br /><br />
                You will receive an email confirmation shortly. Our rider will contact you at the provided phone number before delivery.
            </p>
            <Link href="/shop" className={styles.button}>
                Continue Shopping
            </Link>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navbar />
            <Suspense fallback={<div>Loading...</div>}>
                <SuccessContent />
            </Suspense>
            <Footer />
        </div>
    );
}
