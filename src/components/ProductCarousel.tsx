'use client';

import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import styles from './ProductCarousel.module.css';

type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
};

export default function ProductCarousel({ products, title }: { products: Product[], title: string }) {
    const { addToCart } = useCart();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h2 className={styles.title}>{title}</h2>
                <Link href="/shop" className={styles.viewAll}>View All</Link>
            </div>

            <div className={styles.carousel}>
                {products.map((product) => (
                    <div key={product.id} className={styles.card}>
                        <Link href={`/shop/${product.id}`} className={styles.link}>
                            <div className={styles.imagePlaceholder}>
                                <span className={styles.saleBadge}>SALE</span>
                                <button
                                    className={styles.plusBtn}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        addToCart({ ...product, price: Number(product.price), gender: 'Unisex', category: 'Signature' });
                                    }}
                                >
                                    +
                                </button>
                                {product.image ? (
                                    <img src={product.image} alt={product.name} />
                                ) : (
                                    <span>{product.name}</span>
                                )}
                            </div>
                            <div className={styles.info}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <div className={styles.priceRow}>
                                    <span className={styles.price}>Rs.{Number(product.price).toLocaleString()}</span>
                                    <span className={styles.originalPrice}>Rs.{Number(Number(product.price) * 1.2).toLocaleString()}</span>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}
