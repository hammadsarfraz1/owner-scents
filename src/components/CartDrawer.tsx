'use client';

import { useCart } from '@/context/CartContext';
import styles from './CartDrawer.module.css';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, Truck, Plus, Minus, Sparkles, X } from 'lucide-react';

export default function CartDrawer() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateQuantity, cartTotal } = useCart();
    const [touchStartX, setTouchStartX] = useState<number | null>(null);
    const [touchCurrentX, setTouchCurrentX] = useState<number | null>(null);

    const freeShippingThreshold = 3000;
    const amountForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
    const shippingProgress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

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
        if (diffX > 0) {
            setTouchCurrentX(currentX);
        }
    };

    const handleTouchEnd = () => {
        if (touchStartX !== null && touchCurrentX !== null) {
            const diffX = touchCurrentX - touchStartX;
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
                    <div className={styles.titleGroup}>
                        <ShoppingBag size={20} className={styles.titleIcon} />
                        <h2 className={styles.title}>Your Bag ({cart.length})</h2>
                    </div>
                    <button onClick={toggleCart} className={styles.closeBtn} aria-label="Close cart drawer">
                        <X size={20} />
                    </button>
                </div>

                {cart.length > 0 && (
                    <div className={styles.shippingBanner}>
                        <div className={styles.shippingHeader}>
                            <div className={styles.shippingTitleGroup}>
                                <Truck size={15} className={styles.truckIcon} />
                                <span>
                                    {amountForFreeShipping > 0 ? (
                                        <>Add <strong>Rs. {amountForFreeShipping.toLocaleString()}</strong> for FREE Shipping</>
                                    ) : (
                                        <strong style={{ color: '#34d399' }}>FREE Express Shipping Unlocked!</strong>
                                    )}
                                </span>
                            </div>
                        </div>
                        <div className={styles.progressBarBg}>
                            <div 
                                className={styles.progressBarFill} 
                                style={{ width: `${shippingProgress}%` }} 
                            />
                        </div>
                    </div>
                )}

                <div className={styles.items}>
                    {cart.length === 0 ? (
                        <div className={styles.empty}>
                            <ShoppingBag size={48} className={styles.emptyIcon} />
                            <p>Your bag is currently empty.</p>
                            <Link href="/shop" className={styles.shopNowLink} onClick={toggleCart}>
                                Explore Fragrance Collection <ArrowRight size={14} />
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
                                        Rs. {Number(item.price).toLocaleString()}
                                    </div>
                                    <div className={styles.quantityControls}>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                            className={styles.qtyBtn}
                                            aria-label="Decrease quantity"
                                        >
                                            <Minus size={12} />
                                        </button>
                                        <span className={styles.qtyVal}>{item.quantity}</span>
                                        <button 
                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                            className={styles.qtyBtn}
                                            aria-label="Increase quantity"
                                        >
                                            <Plus size={12} />
                                        </button>
                                    </div>
                                </div>
                                <div className={styles.itemRight}>
                                    <div className={styles.itemTotal}>
                                        Rs. {(Number(item.price) * item.quantity).toLocaleString()}
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item.id)}
                                        className={styles.removeBtn}
                                        aria-label="Remove item"
                                    >
                                        <Trash2 size={16} />
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
                            <span className={styles.totalVal}>Rs. {cartTotal.toLocaleString()}</span>
                        </div>
                        <Link href="/cart" className={styles.viewCartLink} onClick={toggleCart}>
                            View Full Cart Page
                        </Link>
                        <Link href="/checkout" className={`${styles.checkoutBtn} sheenEffect`} onClick={toggleCart}>
                            Proceed to Checkout <ArrowRight size={16} />
                        </Link>
                    </div>
                )}
            </div>
        </>
    );
}
