'use client';

import { useCart } from '@/context/CartContext';
import styles from './QuickViewModal.module.css';
import Link from 'next/link';
import { useState } from 'react';

type Product = {
    id: string;
    name: string;
    price: string;
    description?: string;
    image?: string;
};

type Props = {
    product: Product | null;
    onClose: () => void;
};

export default function QuickViewModal({ product, onClose }: Props) {
    const { addToCart } = useCart();
    const [touchStartY, setTouchStartY] = useState<number | null>(null);
    const [touchCurrentY, setTouchCurrentY] = useState<number | null>(null);

    if (!product) return null;

    const handleTouchStart = (e: React.TouchEvent) => {
        setTouchStartY(e.targetTouches[0].clientY);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (touchStartY === null) return;
        const currentY = e.targetTouches[0].clientY;
        const diffY = currentY - touchStartY;
        // Only allow swiping down (out of screen on mobile bottom sheet layout)
        if (diffY > 0) {
            setTouchCurrentY(currentY);
        }
    };

    const handleTouchEnd = () => {
        if (touchStartY !== null && touchCurrentY !== null) {
            const diffY = touchCurrentY - touchStartY;
            if (diffY > 100) {
                onClose();
            }
        }
        setTouchStartY(null);
        setTouchCurrentY(null);
    };

    const swipeStyle = touchStartY !== null && touchCurrentY !== null
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
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>

                <div className={styles.imageSection}>
                    {product.image ? (
                        <img src={product.image} alt={product.name} className={styles.modalImage} />
                    ) : (
                        product.name
                    )}
                </div>

                <div className={styles.detailsSection}>
                    <h2 className={styles.title}>{product.name}</h2>
                    <p className={styles.price}>${Number(product.price).toFixed(2)}</p>

                    <p className={styles.description}>
                        {product.description || "A luxurious fragrance that embodies elegance and sophistication. Experience the essence of Owner Scents."}
                    </p>

                    <button
                        className={styles.addToCartBtn}
                        onClick={() => {
                            addToCart({ ...product, price: Number(product.price), image: product.image || '' });
                            onClose();
                        }}
                    >
                        Add to Cart
                    </button>

                    <Link href={`/shop/${product.id}`} className={styles.viewDetailsLink}>
                        View Full Details
                    </Link>
                </div>
            </div>
        </div>
    );
}
