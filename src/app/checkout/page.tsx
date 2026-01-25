'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Pakistan'
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    items: cart.map(item => ({
                        productId: item.id,
                        quantity: item.quantity
                    })),
                    total: cartTotal.toString()
                })
            });

            if (!res.ok) throw new Error('Failed to place order');

            const data = await res.json();
            clearCart();
            // Redirect to success page (we will build this next)
            router.push(`/checkout/success?orderId=${data.orderId}`);
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className={styles.container}>
                <Navbar />
                <div style={{ textAlign: 'center', marginTop: '4rem' }}>
                    <h1 className={styles.title}>Your Cart is Empty</h1>
                    <p>Add some scents to your collection first.</p>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Secure Checkout</h1>

                <form onSubmit={handleSubmit} className={styles.grid}>
                    {/* Left Column: Shipping Details */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>Shipping Details</h2>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name</label>
                            <input
                                required
                                name="name"
                                className={styles.input}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.grid} style={{ gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email (Optional)</label>
                                <input
                                    type="email"
                                    name="email"
                                    className={styles.input}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Phone Number *</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    placeholder="03XX-XXXXXXX"
                                    className={styles.input}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Address</label>
                            <input
                                required
                                name="address"
                                className={styles.input}
                                onChange={handleChange}
                            />
                        </div>

                        <div className={styles.grid} style={{ gap: '1rem', gridTemplateColumns: '1fr 1fr' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>City</label>
                                <input
                                    required
                                    name="city"
                                    className={styles.input}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Postal Code</label>
                                <input
                                    name="postalCode"
                                    className={styles.input}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className={styles.summarySection}>
                        <h2 className={styles.sectionTitle}>Order Summary</h2>

                        {cart.map(item => (
                            <div key={item.id} className={styles.summaryRow}>
                                <span>{item.name} x {item.quantity}</span>
                                <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                            </div>
                        ))}

                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            <span>Calculated at next step</span>
                        </div>

                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>

                        <div className={styles.paymentMethod}>
                            <input type="radio" checked readOnly className={styles.radio} />
                            <span>Cash on Delivery (COD)</span>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Place Order'}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </>
    );
}
