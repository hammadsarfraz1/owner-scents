'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

export type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
    gender?: string;
    category?: string;
    topNotes?: string;
    heartNotes?: string;
    baseNotes?: string;
    description?: string;
};

type ProductCardProps = {
    product: Product;
    onQuickView?: (product: Product) => void;
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
    const { addToCart } = useCart();

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        addToCart({ ...product, price: Number(product.price) });
        window.location.href = '/checkout';
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart({ ...product, price: Number(product.price) });
    };

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onQuickView) {
            onQuickView(product);
        }
    };

    return (
        <div className={styles.card}>
            <Link href={`/shop/${product.id}`} className={styles.linkWrapper}>
                <div className={styles.imageContainer}>
                    {product.gender && (
                        <span className={styles.badge}>{product.gender.toUpperCase()}</span>
                    )}
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                            className={styles.productImage}
                        />
                    ) : (
                        <span className={styles.fallbackName}>{product.name}</span>
                    )}
                    
                    {/* Quick Add Button */}
                    <button
                        className={styles.quickAddBtn}
                        onClick={handleAddToCart}
                        aria-label="Quick Add to Cart"
                    >
                        +
                    </button>

                    {/* Hover Notes Overlay */}
                    <div className={styles.notesOverlay}>
                        <div className={styles.notesOverlayContent}>
                            <span className={styles.overlayTitle}>Scent Profile</span>
                            <div className={styles.overlayNote}>
                                <span className={styles.overlayLabel}>Top:</span> {product.topNotes || "Bergamot, Grapefruit"}
                            </div>
                            <div className={styles.overlayNote}>
                                <span className={styles.overlayLabel}>Heart:</span> {product.heartNotes || "Jasmine, Sage"}
                            </div>
                            <div className={styles.overlayNote}>
                                <span className={styles.overlayLabel}>Base:</span> {product.baseNotes || "Sandalwood, Oud"}
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.cardInfo}>
                    <h3 className={styles.productName}>{product.name}</h3>
                    <p className={styles.productPrice}>${Number(product.price).toFixed(2)}</p>
                </div>
            </Link>
            <div className={styles.actions}>
                <button
                    className={styles.buyNowBtn}
                    onClick={handleBuyNow}
                >
                    Buy Now
                </button>
                {onQuickView && (
                    <button
                        className={styles.quickViewBtn}
                        onClick={handleQuickView}
                    >
                        Quick View
                    </button>
                )}
            </div>
        </div>
    );
}
