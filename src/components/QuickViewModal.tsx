'use client';

import { useCart } from '@/context/CartContext';
import styles from './QuickViewModal.module.css';
import Link from 'next/link';
import { useState, useEffect } from 'react';

type Product = {
    id: string;
    name: string;
    price: string;
    originalPrice?: string | number | null;
    description?: string;
    image?: string;
    isOnSale?: boolean;
    salePrice?: number;
};

type Props = {
    product: Product | null;
    onClose: () => void;
};

export default function QuickViewModal({ product, onClose }: Props) {
    const { addToCart } = useCart();
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);
    const [imageError, setImageError] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    // Prevent body scroll and scroll events when open
    useEffect(() => {
        if (product) {
            document.body.style.overflow = 'hidden';
            
            const preventScroll = (e: Event) => {
                const modal = document.querySelector(`.${styles.modal}`);
                if (modal && !modal.contains(e.target as Node)) {
                    e.preventDefault();
                }
            };
            
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            
            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
            };
        }
    }, [product]);

    // Check window size on client
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Reset image error state whenever product changes
    useEffect(() => {
        setImageError(false);
    }, [product]);

    if (!product) return null;

    const handleTouchStart = (e: React.TouchEvent) => {
        if (isMobile) return;
        setTouchStartY(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (isMobile || touchStartY === null) return;
        const currentY = e.targetTouches[0].clientY;
        const diffY = currentY - touchStartY;
        // Only allow swiping down (out of screen on mobile bottom sheet layout)
        if (diffY > 0) {
            setTouchCurrentY(currentY);
        }
    };

    const handleTouchEnd = () => {
        if (isMobile) return;
        if (touchStartY !== null && touchCurrentY !== null) {
            const diffY = touchCurrentY - touchStartY;
            if (diffY > 100) {
                onClose();
            }
        }
        setTouchStartY(null);
        setTouchCurrentY(null);
    };

    const swipeStyle = !isMobile && touchStartY !== null && touchCurrentY !== null
        ? { transform: `translateY(${Math.max(0, touchCurrentY - touchStartY)}px)`, transition: 'none' }
        : {};

    return (
        <div className={`${styles.overlay} ${product ? styles.open : ''}`} onClick={onClose}>
            <div 
                className={styles.modal} 
                onClick={(e) => e.stopPropagation()}
                style={swipeStyle}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            >
                {/* Drag handle for mobile */}
                <div className={styles.dragHandle} />
                <button className={styles.closeBtn} onClick={onClose} aria-label="Close modal">&times;</button>

                <div className={styles.imageSection}>
                    {product.image && !imageError ? (
                        <img 
                            src={product.image} 
                            alt={product.name} 
                            className={styles.modalImage} 
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className={styles.fallbackContainer}>
                            <div className={styles.fallbackInitial}>
                                {product.name.charAt(0).toUpperCase()}
                            </div>
                            <div className={styles.fallbackName}>{product.name}</div>
                        </div>
                    )}
                </div>

                <div className={styles.detailsSection}>
                    <h2 className={styles.title}>{product.name}</h2>
                    {product.originalPrice && Number(product.originalPrice) > 0 ? (
                        <p className={styles.price}>
                            <span className={styles.salePrice}>Rs. {Number(product.price).toLocaleString()}</span>
                            <span className={styles.originalPrice}>Rs. {Number(product.originalPrice).toLocaleString()}</span>
                        </p>
                    ) : product.isOnSale && product.salePrice ? (
                        <p className={styles.price}>
                            <span className={styles.salePrice}>Rs. {Number(product.salePrice).toLocaleString()}</span>
                            <span className={styles.originalPrice}>Rs. {Number(product.price).toLocaleString()}</span>
                        </p>
                    ) : (
                        <p className={styles.price}>
                            <span className={styles.salePrice}>Rs. {Number(product.price).toLocaleString()}</span>
                        </p>
                    )}

                    <p className={styles.description}>
                        {product.description || "A luxurious fragrance that embodies elegance and sophistication. Experience the essence of Owner Scents."}
                    </p>

                    <button
                        className={styles.addToCartBtn}
                        onClick={() => {
                            const finalPrice = product.isOnSale && product.salePrice ? Number(product.salePrice) : Number(product.price);
                            addToCart({ ...product, price: finalPrice, image: product.image || '' });
                            onClose();
                        }}
                    >
                        Add to Cart
                    </button>

                    <Link 
                        href={`/shop/${product.id}`} 
                        className={styles.viewDetailsLink}
                        onClick={onClose}
                    >
                        View Full Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
