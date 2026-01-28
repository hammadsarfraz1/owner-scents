'use client';

import Link from 'next/link';
import styles from './ProductCarousel.module.css';
import ProductCard, { Product } from './ProductCard';

export default function ProductCarousel({
    products,
    title,
    onQuickView
}: {
    products: Product[],
    title: string,
    onQuickView?: (product: Product) => void
}) {

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <Link href="/shop" className={styles.viewAll}>View All</Link>
            </div>

            <div className={styles.carousel}>
                {products.map((product) => (
                    <div key={product.id} className={styles.cardWrapper}>
                        <ProductCard product={product} onQuickView={onQuickView} />
                    </div>
                ))}
            </div>
        </div>
    );
}
