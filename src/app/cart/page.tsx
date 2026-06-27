'use client';

import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';
import { ShoppingBag, Trash2, ArrowRight, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();

    const freeShippingThreshold = 3000;
    const amountForFreeShipping = Math.max(0, freeShippingThreshold - cartTotal);
    const shippingProgress = Math.min(100, (cartTotal / freeShippingThreshold) * 100);

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                {/* Cart Header */}
                <div className={styles.header}>
                    <div className={styles.titleGroup}>
                        <ShoppingBag size={28} className={styles.titleIcon} />
                        <h1 className={styles.title}>Your Shopping Bag</h1>
                    </div>
                </div>

                {cart.length === 0 ? (
                    <div className={styles.emptyState}>
                        <ShoppingBag size={56} className={styles.emptyIcon} />
                        <h2>Your Shopping Bag is Empty</h2>
                        <p>Discover our artisanal fragrance collections and elevate your olfactory presence.</p>
                        <Link href="/shop" className={styles.shopBtn}>
                            Explore Collections <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className={styles.cartLayout}>
                        {/* Left Side: Items List */}
                        <div className={styles.itemsColumn}>
                            {/* Free Shipping Banner */}
                            <div className={styles.shippingBanner}>
                                <div className={styles.shippingHeader}>
                                    <div className={styles.shippingTitleGroup}>
                                        <Truck size={18} className={styles.truckIcon} />
                                        <span>
                                            {amountForFreeShipping > 0 ? (
                                                <>Add <strong>Rs. {amountForFreeShipping.toLocaleString()}</strong> more for <strong>FREE Express Delivery</strong></>
                                            ) : (
                                                <strong style={{ color: '#34d399' }}>Congratulations! You unlocked FREE Express Delivery</strong>
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

                            <div className={styles.itemsList}>
                                {cart.map((item) => {
                                    const unitPrice = Number(item.price);
                                    const itemTotal = unitPrice * item.quantity;
                                    const itemImg = item.image || '/placeholder.png';

                                    return (
                                        <div key={item.id} className={styles.itemCard}>
                                            <div className={styles.itemImgWrapper}>
                                                <img src={itemImg} alt={item.name} className={styles.itemImg} />
                                            </div>

                                            <div className={styles.itemDetails}>
                                                <h3 className={styles.itemName}>{item.name}</h3>
                                                <span className={styles.unitPrice}>Rs. {unitPrice.toLocaleString()} each</span>
                                                
                                                <div className={styles.qtyRow}>
                                                    <div className={styles.qtyControls}>
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
                                            </div>

                                            <div className={styles.itemRight}>
                                                <span className={styles.itemSubtotal}>Rs. {itemTotal.toLocaleString()}</span>
                                                <button
                                                    onClick={() => removeFromCart(item.id)}
                                                    className={styles.removeBtn}
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className={styles.cartListActions}>
                                <button onClick={clearCart} className={styles.clearCartBtn}>
                                    Clear Entire Bag
                                </button>
                                <Link href="/shop" className={styles.continueLink}>
                                    ← Continue Shopping
                                </Link>
                            </div>
                        </div>

                        {/* Right Side: Order Summary Card */}
                        <div className={styles.summaryColumn}>
                            <div className={styles.summaryCard}>
                                <h2 className={styles.summaryTitle}>Order Summary</h2>

                                <div className={styles.summaryRow}>
                                    <span>Subtotal</span>
                                    <span>Rs. {cartTotal.toLocaleString()}</span>
                                </div>

                                <div className={styles.summaryRow}>
                                    <span>Estimated Shipping</span>
                                    <span>{amountForFreeShipping === 0 ? <span style={{ color: '#34d399', fontWeight: 600 }}>FREE</span> : 'Rs. 250'}</span>
                                </div>

                                <div className={styles.divider} />

                                <div className={styles.totalRow}>
                                    <span className={styles.totalLabel}>Grand Total</span>
                                    <span className={styles.totalVal}>
                                        Rs. {(cartTotal + (amountForFreeShipping === 0 ? 0 : 250)).toLocaleString()}
                                    </span>
                                </div>

                                <Link href="/checkout" className={`${styles.checkoutBtn} sheenEffect`}>
                                    Proceed to Checkout <ArrowRight size={16} />
                                </Link>

                                <div className={styles.guaranteeBox}>
                                    <ShieldCheck size={18} className={styles.shieldIcon} />
                                    <span>Guaranteed Artisanal Quality & Encrypted Checkout</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
