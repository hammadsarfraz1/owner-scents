'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';
import { useState, useEffect } from 'react';

let cachedScentNotes: Record<string, string> | null = null;
let scentNotesPromise: Promise<Record<string, string>> | null = null;

function getScentNotes(): Promise<Record<string, string>> {
    if (cachedScentNotes) return Promise.resolve(cachedScentNotes);
    if (scentNotesPromise) return scentNotesPromise;

    scentNotesPromise = fetch('/api/scent-notes')
        .then(res => {
            if (!res.ok) throw new Error('Failed to fetch scent notes');
            return res.json();
        })
        .then(data => {
            cachedScentNotes = data;
            return data;
        })
        .catch(err => {
            console.error("Error loading scent notes:", err);
            return {};
        });

    return scentNotesPromise;
}

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
    const [scentDescriptions, setScentDescriptions] = useState<Record<string, string>>({});

    useEffect(() => {
        getScentNotes().then(setScentDescriptions);
    }, []);

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
                            {scentDescriptions[activeNoteInfo] || `${activeNoteInfo} is a premium fragrance note that adds depth and character to this luxury blend.`}
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
