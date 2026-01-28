'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import styles from './ProductCard.module.css';

export type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
    gender?: string;
    category?: string;
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

    const handleQuickView = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (onQuickView) {
            onQuickView(product);
        }
    };

    return (
        <div className={styles.card}>
            <Link href={`/shop/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.imagePlaceholder}>
                    {product.image ? (
                        <img
                            src={product.image}
                            alt={product.name}
                        />
                    ) : (
                        <span>{product.name}</span>
                    )}
                </div>
                <div className={styles.cardInfo}>
                    <h3>{product.name}</h3>
                    <p>${Number(product.price).toFixed(2)}</p>
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
                        View
                    </button>
                )}
            </div>
        </div>
    );
}
