'use client';

import { useCart } from '@/context/CartContext';
import styles from './QuickViewModal.module.css';
import Link from 'next/link';

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

    if (!product) return null;

    return (
        <div className={`${styles.overlay} ${product ? styles.open : ''}`} onClick={onClose}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <button className={styles.closeBtn} onClick={onClose}>&times;</button>

                <div className={styles.imageSection}>
                    {product.name}
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
