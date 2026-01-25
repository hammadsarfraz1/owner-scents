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
                                {product.image ? (
                                    <img src={product.image} alt={product.name} />
                                ) : (
                                    <span>{product.name}</span>
                                )}
                            </div>
                            <div className={styles.info}>
                                <h3 className={styles.productName}>{product.name}</h3>
                                <p className={styles.price}>${Number(product.price).toFixed(2)}</p>
                            </div>
                        </Link>
                        <button
                            className={styles.addBtn}
                            onClick={(e) => {
                                e.preventDefault();
                                addToCart({ ...product, price: Number(product.price), gender: 'Unisex', category: 'Signature' });
                            }}
                        >
                            Add to Cart
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
