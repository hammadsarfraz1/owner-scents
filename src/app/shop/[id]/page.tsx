'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
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

type Review = {
    name: string;
    rating: number;
    comment: string;
    date: string;
};

export default function ProductDetails() {
    const params = useParams();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();

    // Local Review State
    const [reviews, setReviews] = useState<Review[]>([]);
    const [revName, setRevName] = useState('');
    const [revRating, setRevRating] = useState(5);
    const [revComment, setRevComment] = useState('');

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

        // Load reviews from local storage or set defaults
        const storedReviews = localStorage.getItem(`reviews_${product.id}`);
        if (storedReviews) {
            setReviews(JSON.parse(storedReviews));
        } else {
            const defaults = [
                {
                    name: "James S.",
                    rating: 5,
                    comment: `Absolutely brilliant scent. The projection is powerful and the notes linger beautifully for 8+ hours. Highly recommended.`,
                    date: "June 12, 2026"
                },
                {
                    name: "Sarah M.",
                    rating: 4,
                    comment: `Stunning fragrance, very unique and premium feel. It's a bit intense at first spray, but settles down into a gorgeous olfactory base.`,
                    date: "June 20, 2026"
                }
            ];
            setReviews(defaults);
            localStorage.setItem(`reviews_${product.id}`, JSON.stringify(defaults));
        }
    }, [product]);

    const handleAddReview = (e: React.FormEvent) => {
        e.preventDefault();
        if (!revName.trim() || !revComment.trim() || !product) return;

        const newReview: Review = {
            name: revName,
            rating: revRating,
            comment: revComment,
            date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
        };

        const updated = [newReview, ...reviews];
        setReviews(updated);
        localStorage.setItem(`reviews_${product.id}`, JSON.stringify(updated));

        // Clear form
        setRevName('');
        setRevRating(5);
        setRevComment('');
    };

    if (loading) return <div className={styles.loading}>Loading Essence...</div>;
    if (!product) return <div className={styles.loading}>Product not found</div>;

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
        : "5.0";

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.content}>
                <div className={styles.grid}>
                    {/* Image Section */}
                    <div className={styles.imageContainer}>
                        {product.image ? (
                            <img src={product.image} alt={product.name} className={styles.productImage} />
                        ) : (
                            <div className={styles.placeholderImage}>{product.name}</div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className={styles.details}>
                        <div className={styles.breadcrumbs}>
                            <Link href="/">Home</Link> / <Link href="/shop">Shop</Link> / {product.name}
                        </div>
                        <h1 className={styles.title}>{product.name}</h1>
                        <div className={styles.meta}>
                            <span className={styles.badge}>{product.gender.toUpperCase()}</span>
                            <span className={styles.badge}>{product.category.toUpperCase()}</span>
                            <span className={styles.starText}>★ {avgRating} ({reviews.length} Reviews)</span>
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
                            <button
                                className={styles.wishlistBtn}
                                onClick={() => toggleWishlist(product.id)}
                            >
                                {isInWishlist(product.id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                            </button>
                        </div>

                        {/* Olfactive Pyramid */}
                        <div className={styles.pyramidSection}>
                            <h3>Olfactory Notes</h3>
                            <div className={styles.pyramid}>
                                <div className={styles.noteRow}>
                                    <span className={styles.noteLabel}>TOP</span>
                                    <span className={styles.noteValue}>{product.topNotes || "Bergamot, Grapefruit"}</span>
                                </div>
                                <div className={styles.noteRow}>
                                    <span className={styles.noteLabel}>HEART</span>
                                    <span className={styles.noteValue}>{product.heartNotes || "Jasmine, Sage"}</span>
                                </div>
                                <div className={styles.noteRow}>
                                    <span className={styles.noteLabel}>BASE</span>
                                    <span className={styles.noteValue}>{product.baseNotes || "Sandalwood, Patchouli"}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <section className={styles.reviewsSection}>
                    <div className={styles.reviewsHeader}>
                        <h2>Customer Appraisal</h2>
                        <p>Real experiences from our customers.</p>
                    </div>

                    <div className={styles.reviewsGrid}>
                        {/* Write review */}
                        <div className={styles.reviewFormCard}>
                            <h3>Add Your Review</h3>
                            <form onSubmit={handleAddReview} className={styles.reviewForm}>
                                <div className={styles.formGroup}>
                                    <label>Your Name</label>
                                    <input 
                                        type="text" 
                                        required 
                                        value={revName} 
                                        onChange={(e) => setRevName(e.target.value)} 
                                        className={styles.input}
                                        placeholder="Enter your name"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Rating</label>
                                    <select 
                                        value={revRating} 
                                        onChange={(e) => setRevRating(Number(e.target.value))} 
                                        className={styles.select}
                                    >
                                        <option value={5}>5 Stars - Excellent</option>
                                        <option value={4}>4 Stars - Good</option>
                                        <option value={3}>3 Stars - Average</option>
                                        <option value={2}>2 Stars - Below Average</option>
                                        <option value={1}>1 Star - Poor</option>
                                    </select>
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Your Experience</label>
                                    <textarea 
                                        required 
                                        rows={4} 
                                        value={revComment} 
                                        onChange={(e) => setRevComment(e.target.value)} 
                                        className={styles.textarea}
                                        placeholder="Describe the performance, projection, and scent note transition..."
                                    />
                                </div>
                                <button type="submit" className={styles.submitReviewBtn}>Submit Review</button>
                            </form>
                        </div>

                        {/* List reviews */}
                        <div className={styles.reviewsList}>
                            <h3>Shared Reviews ({reviews.length})</h3>
                            {reviews.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first to share your experience!</p>
                            ) : (
                                reviews.map((r, idx) => (
                                    <div key={idx} className={styles.reviewCard}>
                                        <div className={styles.reviewMeta}>
                                            <span className={styles.reviewerName}>{r.name}</span>
                                            <span className={styles.reviewDate}>{r.date}</span>
                                        </div>
                                        <div className={styles.reviewStars}>
                                            {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                                        </div>
                                        <p className={styles.reviewComment}>{r.comment}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </section>

                {/* Related Section */}
                {relatedProducts.length > 0 && (
                    <div className={styles.relatedSection}>
                        <h2 className={styles.relatedTitle}>You May Also Like</h2>
                        <div className={styles.relatedGrid}>
                            {relatedProducts.map(rel => (
                                <ProductCard key={rel.id} product={rel} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <Footer />
        </div >
    );
}
