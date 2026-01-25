'use client';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';

export default function Cart() {
    const { cart, removeFromCart, cartTotal, clearCart } = useCart();

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <h1 className={styles.title}>Your Cart</h1>

                {cart.length === 0 ? (
                    <div className={styles.emptyState}>
                        <p>Your cart is currently empty.</p>
                        <a href="/shop" className="btn" style={{ marginTop: '2rem' }}>Continue Shopping</a>
                    </div>
                ) : (
                    <div className={styles.cartContent}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th style={{ textAlign: 'left' }}>Product</th>
                                    <th>Quantity</th>
                                    <th>Total</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {cart.map((item) => (
                                    <tr key={item.id}>
                                        <td style={{ textAlign: 'left' }}>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>${(item.price * item.quantity).toFixed(2)}</td>
                                        <td>
                                            <button
                                                onClick={() => removeFromCart(item.id)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                                            >
                                                Remove
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className={styles.summary}>
                            <h3>Total: ${cartTotal.toFixed(2)}</h3>
                            <div className={styles.actions}>
                                <button onClick={clearCart} style={{ marginRight: '1rem', background: 'none', border: 'none', cursor: 'pointer' }}>Clear Cart</button>
                                <Link href="/checkout" className="btn" style={{ display: 'inline-block', textDecoration: 'none' }}>Checkout</Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
