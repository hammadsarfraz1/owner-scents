'use client';

import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import Link from 'next/link';
import { useEffect } from 'react';

export default function CartDrawer() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();

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
                            <Link href="/shop" className={styles.shopNowLink} onClick={toggleCart}>
                                Shop the collection
                            </Link>
                        </div>
                    ) : (
                        cart.map((item) => (
                            <div key={item.id} className={styles.item}>
                                <div className={styles.itemImage}>
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className={styles.cartImg} />
                                    ) : (
                                        <span className={styles.fallbackText}>{item.name[0]}</span>
                                    )}
                                </div>
                                <div className={styles.itemDetails}>
                                    <div className={styles.itemName}>{item.name}</div>
                                    <div className={styles.itemPrice}>
                                        ${Number(item.price).toFixed(2)}
                                    </div>
                                    <div className={styles.quantityControls}>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className={styles.qtyBtn}
                                        >
                                            -
                                        </button>
                                        <span className={styles.qtyVal}>{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className={styles.qtyBtn}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.itemRight}>
                                    <div className={styles.itemTotal}>
                                        ${(Number(item.price) * item.quantity).toFixed(2)}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className={styles.removeBtn}
                                        aria-label="Remove item"
                                    >
                                        &times;
                                    </button>
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
