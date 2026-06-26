'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useWishlist } from '@/context/WishlistContext';
import Link from 'next/link';

type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
    isOnSale?: boolean;
    salePrice?: number;
};

export default function WishlistPage() {
    const { wishlist, toggleWishlist } = useWishlist();
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (wishlist.length === 0) {
            setProducts([]);
            setLoading(false);
            return;
        }

        // Fetch details for all wishlisted items
        // In a real app, I'd have a specific endpoint for this or use a query param
        // For now, I'll just fetch all products and filter (inefficient but works for small scale)
        // OR better: fetch each by ID.
        // Let's assume fetching all for now since I don't have a bulk fetch endpoint.
        fetch('/api/products')
            .then(res => res.json())
            .then((data: Product[]) => {
                const wishlistedProducts = data.filter(p => wishlist.includes(p.id));
                setProducts(wishlistedProducts);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, [wishlist]);

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={`container ${styles.wishlistContainer}`}>
                <h1 className={styles.title}>Your Wishlist</h1>

                {loading ? (
                    <p>Loading...</p>
                ) : products.length === 0 ? (
                    <div className={styles.empty}>
                        <p>Your wishlist is empty.</p>
                        <Link href="/shop" className="btn">Discover Scents</Link>
                    </div>
                ) : (
                    <div className={styles.grid}>
                        {products.map(product => (
                            <div key={product.id} className={styles.card}>
                                <div className={styles.imageContainer}>
                                    {product.image ? (
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className={styles.productImage}
                                        />
                                    ) : (
                                        <span className={styles.fallbackName}>{product.name}</span>
                                    )}
                                </div>
                                <div className={styles.info}>
                                    <h3>{product.name}</h3>
                                    <p className={styles.productPrice}>
                                        {product.isOnSale && product.salePrice ? (
                                            <>
                                                <span className={styles.salePrice}>${Number(product.salePrice).toFixed(2)}</span>
                                                <span className={styles.originalPrice}>${Number(product.price).toFixed(2)}</span>
                                            </>
                                        ) : (
                                            <>
                                                <span className={styles.salePrice}>${Number(product.price).toFixed(2)}</span>
                                                <span className={styles.originalPrice}>${(Number(product.price) * 1.3).toFixed(2)}</span>
                                            </>
                                        )}
                                    </p>
                                    <div className={styles.actions}>
                                        <Link href={`/shop/${product.id}`} className={styles.viewBtn}>View</Link>
                                        <button
                                            onClick={() => toggleWishlist(product.id)}
                                            className={styles.removeBtn}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <Footer />
        </div>
    );
}
