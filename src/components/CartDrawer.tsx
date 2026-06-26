'use client';

import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CartDrawer() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);

    // Prevent scrolling when cart is open
    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
            
            const preventScroll = (e: Event) => {
                const drawer = document.querySelector(`.${styles.drawer}`);
                if (drawer && !drawer.contains(e.target as Node)) {
                    e.preventDefault();
                }
            };
            
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            
            return () => {
                document.body.style.overflow = 'unset';
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
            };
        }
    }, [isCartOpen]);

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartX(e.targetTouches[0].clientX);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartX === null) return;
        const currentX = e.targetTouches[0].clientX;
        const diffX = currentX - touchStartX;
        // Only allow swiping right (out of screen)
        if (diffX > 0) {
            setTouchCurrentX(currentX);
        }
    };

    const handleTouchEnd = () => {
        if (touchStartX !== null && touchCurrentX !== null) {
            const diffX = touchCurrentX - touchStartX;
            // Dismiss if swiped more than 100px
            if (diffX > 100) {
                toggleCart();
            }
        }
        setTouchStartX(null);
        setTouchCurrentX(null);
    };

    const swipeStyle = touchStartX !== null && touchCurrentX !== null
        ? { transform: `translateX(${Math.max(0, touchCurrentX - touchStartX)}px)`, transition: 'none' }
        : {};

    return (
        <>
            {/* Overlay */}
            <div
                className={`${styles.overlay} ${isCartOpen ? styles.open : ''}`}
                onClick={toggleCart}
            />

            {/* Drawer */}
            <div 
                className={`${styles.drawer} ${isCartOpen ? styles.open : ''}`}
                style={swipeStyle}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
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
                        <Link href="/checkout" className={`${styles.checkoutBtn} sheenEffect`} onClick={toggleCart}>
                            Proceed to Checkout
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
