'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './page.module.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
    const { cart, cartTotal, clearCart } = useCart();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState<'COD' | 'CARD'>('COD');
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        fetch('/api/homepage-config')
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(console.error);
    }, []);

    const shippingPrice = config ? Number(config.shippingPrice) : 250;
    const freeShippingThreshold = config ? Number(config.freeShippingThreshold) : 3000;
    const shippingCost = cartTotal >= freeShippingThreshold ? 0 : shippingPrice;
    const grandTotal = cartTotal + shippingCost;
    
    // Address Details
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        city: '',
        postalCode: '',
        country: 'Pakistan'
    });

    // Card Details
    const [cardData, setCardData] = useState({
        number: '',
        expiry: '',
        cvc: '',
        nameOnCard: ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        
        if (name === 'number') {
            // Remove non-digits, cap at 16 digits, format with spaces
            const digits = value.replace(/\D/g, '').substring(0, 16);
            const formatted = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
            setCardData(prev => ({ ...prev, number: formatted }));
        } else if (name === 'expiry') {
            // Remove non-digits, cap at 4 digits, format as MM/YY
            const digits = value.replace(/\D/g, '').substring(0, 4);
            let formatted = digits;
            if (digits.length > 2) {
                formatted = `${digits.substring(0, 2)}/${digits.substring(2)}`;
            }
            setCardData(prev => ({ ...prev, expiry: formatted }));
        } else if (name === 'cvc') {
            const digits = value.replace(/\D/g, '').substring(0, 3);
            setCardData(prev => ({ ...prev, cvc: digits }));
        } else {
            setCardData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        // Simulated validation for Card Payments
        if (paymentMethod === 'CARD') {
            const cleanCardNum = cardData.number.replace(/\s/g, '');
            if (cleanCardNum.length !== 16) {
                alert('Please enter a valid 16-digit credit card number.');
                setLoading(false);
                return;
            }
            if (cardData.expiry.length !== 5) {
                alert('Please enter a valid expiry date (MM/YY).');
                setLoading(false);
                return;
            }
            if (cardData.cvc.length !== 3) {
                alert('Please enter a valid 3-digit CVC/CVV.');
                setLoading(false);
                return;
            }
            if (!cardData.nameOnCard.trim()) {
                alert('Please enter the name on the card.');
                setLoading(false);
                return;
            }
        }

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
                    total: grandTotal.toString(),
                    paymentMethod: paymentMethod,
                    paymentStatus: paymentMethod === 'CARD' ? 'PAID' : 'PENDING'
                })
            });

            if (!res.ok) throw new Error('Failed to place order');

            const data = await res.json();
            clearCart();
            window.location.href = `/checkout/success?orderId=${data.orderId}`;
        } catch (error) {
            console.error(error);
            alert('Something went wrong. Please try again.');
            setLoading(false);
        }
    };

    if (cart.length === 0) {
        return (
            <div className={styles.main}>
                <Navbar />
                <div className={styles.emptyContainer}>
                    <h1 className={styles.title}>Your Bag is Empty</h1>
                    <p className={styles.subtitle}>Select from our curated fragrance catalog to continue.</p>
                    <Link href="/shop" className="btn">Browse Shop</Link>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Secure Checkout</h1>

                <form onSubmit={handleSubmit} className={styles.grid}>
                    {/* Left Column: Shipping & Payment */}
                    <div className={styles.formSection}>
                        <h2 className={styles.sectionTitle}>1. Shipping Details</h2>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Full Name *</label>
                            <input
                                required
                                name="name"
                                value={formData.name}
                                className={styles.input}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div className={styles.gridRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    className={styles.input}
                                    onChange={handleChange}
                                    placeholder="name@domain.com"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Phone Number *</label>
                                <input
                                    required
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    placeholder="03XX-XXXXXXX"
                                    className={styles.input}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Delivery Address *</label>
                            <input
                                required
                                name="address"
                                value={formData.address}
                                className={styles.input}
                                onChange={handleChange}
                                placeholder="House / Apartment #, Street Name, Sector"
                            />
                        </div>

                        <div className={styles.gridRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>City *</label>
                                <input
                                    required
                                    name="city"
                                    value={formData.city}
                                    className={styles.input}
                                    onChange={handleChange}
                                    placeholder="e.g. Islamabad"
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Postal Code *</label>
                                <input
                                    required
                                    name="postalCode"
                                    value={formData.postalCode}
                                    className={styles.input}
                                    onChange={handleChange}
                                    placeholder="e.g. 44000"
                                />
                            </div>
                        </div>

                        <h2 className={styles.sectionTitle} style={{ marginTop: '3rem' }}>2. Payment Method</h2>

                        <div className={styles.paymentToggle}>
                            <button
                                type="button"
                                className={`${styles.toggleBtn} ${paymentMethod === 'COD' ? styles.active : ''}`}
                                onClick={() => setPaymentMethod('COD')}
                            >
                                Cash on Delivery (COD)
                            </button>
                            <button
                                type="button"
                                className={`${styles.toggleBtn} ${paymentMethod === 'CARD' ? styles.active : ''}`}
                                onClick={() => setPaymentMethod('CARD')}
                            >
                                Credit / Debit Card (Simulated)
                            </button>
                        </div>

                        {paymentMethod === 'CARD' && (
                            <div className={styles.cardForm}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Cardholder Name</label>
                                    <input
                                        type="text"
                                        name="nameOnCard"
                                        value={cardData.nameOnCard}
                                        onChange={handleCardChange}
                                        className={styles.input}
                                        placeholder="Name printed on card"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Card Number</label>
                                    <input
                                        type="text"
                                        name="number"
                                        value={cardData.number}
                                        onChange={handleCardChange}
                                        className={styles.input}
                                        placeholder="0000 0000 0000 0000"
                                    />
                                </div>
                                <div className={styles.gridRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Expiration Date</label>
                                        <input
                                            type="text"
                                            name="expiry"
                                            value={cardData.expiry}
                                            onChange={handleCardChange}
                                            className={styles.input}
                                            placeholder="MM/YY"
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>CVC / CVV</label>
                                        <input
                                            type="text"
                                            name="cvc"
                                            value={cardData.cvc}
                                            onChange={handleCardChange}
                                            className={styles.input}
                                            placeholder="123"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Column: Order Summary */}
                    <div className={styles.summarySection}>
                        <h2 className={styles.sectionTitle}>Order Summary</h2>

                        <div className={styles.summaryItems}>
                            {cart.map(item => (
                                <div key={item.id} className={styles.summaryRow}>
                                    <span className={styles.itemName}>{item.name} x {item.quantity}</span>
                                    <span className={styles.itemPrice}>Rs. {(Number(item.price) * item.quantity).toLocaleString()}</span>
                                </div>
                            ))}
                        </div>

                        <div className={styles.summaryRow}>
                            <span>Shipping</span>
                            {shippingCost === 0 ? (
                                <span style={{ color: 'var(--accent)', fontWeight: 500 }}>FREE</span>
                            ) : (
                                <span style={{ color: 'var(--text-primary)', fontWeight: 500 }}>Rs. {shippingCost.toLocaleString()}</span>
                            )}
                        </div>

                        <div className={styles.totalRow}>
                            <span>Total</span>
                            <span>Rs. {grandTotal.toLocaleString()}</span>
                        </div>

                        <button
                            type="submit"
                            className={styles.submitBtn}
                            disabled={loading}
                        >
                            {loading ? 'Validating Payment & Placing Order...' : `Pay & Place Order - Rs. ${grandTotal.toLocaleString()}`}
                        </button>
                    </div>
                </form>
            </div>
            <Footer />
        </div>
    );
}
