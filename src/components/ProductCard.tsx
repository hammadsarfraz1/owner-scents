'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';
import { useState } from 'react';

const SCENT_DESCRIPTIONS: Record<string, string> = {
    "Bergamot": "Fresh, citrusy, and slightly spicy scent. Found in high-end top notes.",
    "Grapefruit": "Bright, zesty, and energizing citrus note.",
    "Jasmine": "Rich, warm, sweet floral note. Provides a luxurious heart.",
    "Sage": "Herbal, clean, and earthy notes for a masculine/unisex touch.",
    "Sandalwood": "Creamy, rich, exotic wood scent. A classic luxury base note.",
    "Oud": "Deep, smoky, woody, and prestigious oriental resin note.",
    "Rose": "Classic, romantic floral note with powdery and sweet facets.",
    "Amber": "Warm, sweet, resinous, and cozy base note.",
    "Vanilla": "Sweet, comforting, and warm balsamic note.",
    "Patchouli": "Earthy, sweet, and dark musky note with wood tones.",
    "Musk": "Sensual, clean, and animalic note that lingers on skin.",
    "Lavender": "Aromatic, clean, floral, and calming herb note.",
    "Cedarwood": "Dry, clean woody scent. Provides structure and longevity."
};

export type Product = {
    id: string;
    name: string;
    price: string;
    originalPrice?: string | number | null;
    image: string;
    gender?: string;
    category?: string;
    topNotes?: string;
    heartNotes?: string;
    baseNotes?: string;
    description?: string;
    isOnSale?: boolean;
    salePrice?: number;
};

type ProductCardProps = {
    product: Product;
    onQuickView?: (product: Product) => void;
};

export default function ProductCard({ product, onQuickView }: ProductCardProps) {
    const { addToCart } = useCart();
    const [activeNoteInfo, setActiveNoteInfo] = useState<string | null>(null);

    const getBadges = () => {
        const notes: string[] = [];
        if (product.topNotes) notes.push(...product.topNotes.split(',').map(n => n.trim()));
        if (product.heartNotes) notes.push(...product.heartNotes.split(',').map(n => n.trim()));
        if (product.baseNotes) notes.push(...product.baseNotes.split(',').map(n => n.trim()));
        return Array.from(new Set(notes)).filter(Boolean);
    };

    const allBadges = getBadges();

    const handleBadgeClick = (e: React.MouseEvent, note: string) => {
        e.preventDefault();
        e.stopPropagation();
        setActiveNoteInfo(note);
    };

    const handleBuyNow = (e: React.MouseEvent) => {
        e.preventDefault();
        const priceToUse = product.isOnSale && product.salePrice ? Number(product.salePrice) : Number(product.price);
        addToCart({ ...product, price: priceToUse });
        window.location.href = '/checkout';
    };

    const handleAddToCart = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        const priceToUse = product.isOnSale && product.salePrice ? Number(product.salePrice) : Number(product.price);
        addToCart({ ...product, price: priceToUse });
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
                        <span className={`${styles.badge} ${styles[product.gender.toLowerCase()] || ''}`}>
                            {product.gender.toUpperCase()}
                        </span>
                    )}
                    {product.isOnSale && (
                        <span className={styles.saleBadge}>
                            SALE
                        </span>
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
                    {product.originalPrice && Number(product.originalPrice) > 0 ? (
                        <p className={styles.productPrice}>
                            <span className={styles.salePrice}>Rs. {Number(product.price).toLocaleString()}</span>
                            <span className={styles.originalPrice}>Rs. {Number(product.originalPrice).toLocaleString()}</span>
                        </p>
                    ) : product.isOnSale && product.salePrice ? (
                        <p className={styles.productPrice}>
                            <span className={styles.salePrice}>Rs. {Number(product.salePrice).toLocaleString()}</span>
                            <span className={styles.originalPrice}>Rs. {Number(product.price).toLocaleString()}</span>
                        </p>
                    ) : (
                        <p className={styles.productPrice}>
                            <span className={styles.salePrice}>Rs. {Number(product.price).toLocaleString()}</span>
                        </p>
                    )}
                    
                    {allBadges.length > 0 && (
                        <div className={styles.scentBadgesContainer}>
                            {allBadges.slice(0, 3).map((note) => (
                                <button
                                    key={note}
                                    className={styles.scentBadge}
                                    onClick={(e) => handleBadgeClick(e, note)}
                                >
                                    {note}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
            <div className={styles.actions}>
                <button
                    className={`${styles.buyNowBtn} sheenEffect`}
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

            {/* Scent Note Tooltip Overlay */}
            {activeNoteInfo && (
                <div className={styles.badgeTooltipBackdrop} onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setActiveNoteInfo(null);
                }}>
                    <div className={styles.badgeTooltip} onClick={(e) => e.stopPropagation()}>
                        <h4 className={styles.tooltipTitle}>{activeNoteInfo}</h4>
                        <p className={styles.tooltipDesc}>
                            {SCENT_DESCRIPTIONS[activeNoteInfo] || `${activeNoteInfo} is a premium fragrance note that adds depth and character to this luxury blend.`}
                        </p>
                        <button className={styles.tooltipCloseBtn} onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveNoteInfo(null);
                        }}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
