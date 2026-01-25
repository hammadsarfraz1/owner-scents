'use client';

import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CartDrawer() {
    const { cart, isCartOpen, toggleCart, removeFromCart, cartTotal } = useCart();

    // Prevent scrolling when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`}
                onClick={toggleCart}
            />

            {/* Drawer */}
            <div className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Your Bag ({cart.length})</h2>
                    <button onClick={toggleCart} className={styles.closeBtn}>&times;</button>
                </div>

                <div className={styles.items}>
                    {cart.length === 0 ? (
                        <div className={styles.empty}>
                            <p>Your bag is empty.</p>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <div className={styles.itemImage}>
                                    {/* Placeholder for image */}
                                    {item.name}
                                </div>
                                <div className={styles.itemDetails}>
                                    <div className={styles.itemName}>{item.name}</div>
                                    <div className={styles.itemPrice}>
                                        ${Number(item.price).toFixed(2)} x {item.quantity}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className={styles.removeBtn}
                                    >
                                        Remove
                                    </button>
                                </div>
                                <div>
                                    ${(Number(item.price) * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {cart.length > 0 && (
                    <div className={styles.footer}>
                        <div className={styles.totalRow}>
                            <span>Subtotal</span>
                            <span>${cartTotal.toFixed(2)}</span>
                        </div>
                        <Link href="/checkout" className={styles.checkoutBtn} onClick={toggleCart}>
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
