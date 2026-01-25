'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useWishlist } from '@/context/WishlistContext';
import { useCart } from '@/context/CartContext';
import { useParams } from 'next/navigation';

type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    gender: string;
    category: string;
    topNotes: string;
    heartNotes: string;
    baseNotes: string;
};

export default function ProductDetails() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    useEffect(() => {
        fetch(`/api/products/${params.id}`)
            .then((res) => res.json())
            .then((data) => {
                setProduct(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, [params.id]);

    useEffect(() => {
        if (!product) return;

        fetch('/api/products')
            .then((res) => res.json())
            .then((data: Product[]) => {
                const related = data
                    .filter(p => p.id !== product.id && (p.category === product.category || p.gender === product.gender))
                    .slice(0, 3);
                setRelatedProducts(related);
            })
            .catch(console.error);
    }, [product]);

    if (loading) return <div className={styles.loading}>Loading Essence...</div>;
    if (!product) return <div className={styles.loading}>Product not found</div>;

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.content}>
                <div className={styles.grid}>
                    {/* Image Section */}
                    <div className={styles.imageContainer}>
                        {product.image ? (
                            <img src={product.image} alt={product.name} className={styles.placeholderImage} style={{ objectFit: 'cover' }} />
                        ) : (
                            <div className={styles.placeholderImage}>{product.name}</div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className={styles.details}>
                        <div className={styles.breadcrumbs}>Home / Shop / {product.name}</div>
                        <h1 className={styles.title}>{product.name}</h1>
                        <div className={styles.meta}>
                            <span className={styles.gender}>{product.gender}</span>
                            <span className={styles.dot}>•</span>
                            <span className={styles.category}>{product.category}</span>
                        </div>
                        <div className={styles.price}>${Number(product.price).toFixed(2)}</div>

                        <p className={styles.description}>{product.description}</p>

                        <div className={styles.actionButtons}>
                            <button
                                className={styles.buyNowBtn}
                                onClick={() => {
                                    addToCart({ ...product, price: Number(product.price), id: product.id });
                                    window.location.href = '/checkout';
                                }}
                            >
                                Buy Now - ${Number(product.price).toFixed(2)}
                            </button>
                            <button
                                className={styles.addToCartBtn}
                                onClick={() => addToCart({ ...product, price: Number(product.price), id: product.id })}
                            >
                                Add to Cart
                            </button>
                        </div>

                        <button
                            className={styles.wishlistBtn}
                            onClick={() => toggleWishlist(product.id)}
                            style={{
                                marginTop: '1rem',
                                background: 'transparent',
                                border: '1px solid var(--text-primary)',
                                color: 'var(--text-primary)',
                                width: '100%',
                                padding: '1rem',
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                letterSpacing: '1px'
                            }}
                        >
                            {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                        </button>

                        {/* Olfactive Pyramid */}
                        <div className={styles.pyramidSection}>
                            <h3>Olfactory Notes</h3>
                            <div className={styles.pyramid}>
                                <div className={styles.noteRow}>
                                    <span className={styles.noteLabel}>TOP</span>
                                    <span className={styles.noteValue}>{product.topNotes}</span>
                                </div>
                                <div className={styles.noteRow}>
                                    <span className={styles.noteLabel}>HEART</span>
                                    <span className={styles.noteValue}>{product.heartNotes}</span>
                                </div>
                                <div className={styles.noteRow}>
                                    <span className={styles.noteLabel}>BASE</span>
                                    <span className={styles.noteValue}>{product.baseNotes}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {relatedProducts.length > 0 && (
                    <div className={styles.relatedSection}>
                        <h2 className={styles.relatedTitle}>You May Also Like</h2>
                        <div className={styles.relatedGrid}>
                            {relatedProducts.map(rel => (
                                <Link key={rel.id} href={`/shop/${rel.id}`} className={styles.relatedCard}>
                                    <div className={styles.relatedPlaceholder}>
                                        {rel.image ? <img src={rel.image} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={rel.name} /> : rel.name}
                                    </div>
                                    <div className={styles.relatedInfo}>
                                        <h4>{rel.name}</h4>
                                        <p>${Number(rel.price).toFixed(2)}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div >
    );
}
