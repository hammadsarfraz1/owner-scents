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
import { useSession } from "next-auth/react";

type Product = {
    id: string;
    name: string;
    price: string;
    originalPrice?: string | number | null;
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
    const { data: session } = useSession();
    const [product, setProduct] = useState<Product | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { toggleWishlist, isInWishlist } = useWishlist();
    const [showStickyBar, setShowStickyBar] = useState(false);
    const [hasPurchased, setHasPurchased] = useState(false);

    // Dynamic Scent Notes
    const [scentDescriptions, setScentDescriptions] = useState<Record<string, string>>({});
    const [activeNote, setActiveNote] = useState<string | null>(null);

    useEffect(() => {
        fetch('/api/scent-notes')
            .then(res => {
                if (res.ok) return res.json();
                return {};
            })
            .then(setScentDescriptions)
            .catch(err => console.error('Error fetching scent notes:', err));
    }, []);

    // Local Review State
    const [reviews, setReviews] = useState<Review[]>([]);
    const [revName, setRevName] = useState('');
    const [revRating, setRevRating] = useState(5);
    const [revComment, setRevComment] = useState('');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [params.id]);

    useEffect(() => {
        if (!session) {
            setHasPurchased(false);
            return;
        }
        fetch('/api/user/orders')
            .then(res => {
                if (res.ok) return res.json();
                return [];
            })
            .then(orders => {
                const purchased = orders.some((order: any) => 
                    order.items.some((item: any) => item.productId === params.id)
                );
                setHasPurchased(purchased);
            })
            .catch(err => {
                console.error('Error checking purchase:', err);
                setHasPurchased(false);
            });
    }, [session, params.id]);

    useEffect(() => {
        const handleScroll = () => {
            const actionBtn = document.querySelector(`.${styles.actionButtons}`);
            if (actionBtn) {
                const rect = actionBtn.getBoundingClientRect();
                // Show sticky bar once we scroll past the action buttons section
                setShowStickyBar(rect.bottom < 0);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

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

        // Load reviews from database API
        fetch(`/api/products/${product.id}/reviews`)
            .then((res) => {
                if (res.ok) return res.json();
                throw new Error('Failed to fetch reviews');
            })
            .then((data: Review[]) => {
                setReviews(data);
            })
            .catch((err) => {
                console.error(err);
                // Fallback to local storage or defaults if API fails
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
                }
            });
    }, [product]);

    const handleAddReview = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!revName.trim() || !revComment.trim() || !product) return;

        try {
            const res = await fetch(`/api/products/${product.id}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: revName,
                    rating: revRating,
                    comment: revComment
                })
            });

            if (res.ok) {
                const newReview = await res.json();
                setReviews(prev => [newReview, ...prev]);
                
                // Clear form
                setRevName('');
                setRevRating(5);
                setRevComment('');
            } else {
                alert('Failed to submit review.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to submit review due to a network error.');
        }
    };

    if (loading) return <div className={styles.loading}>Loading Essence...</div>;
    if (!product) return <div className={styles.loading}>Product not found</div>;

    const avgRating = reviews.length > 0 
        ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / reviews.length).toFixed(1) 
        : "5.0";

    const parseNotes = (notesString: string) => {
        if (!notesString) return [];
        return notesString.split(',').map(n => n.trim()).filter(Boolean);
    };

    const topNotesList = parseNotes(product.topNotes || "Bergamot, Grapefruit");
    const heartNotesList = parseNotes(product.heartNotes || "Jasmine, Sage");
    const baseNotesList = parseNotes(product.baseNotes || "Sandalwood, Patchouli");

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
                        <div className={styles.price}>
                            <span className={styles.salePrice}>Rs. {Number(product.price).toLocaleString()}</span>
                            {product.originalPrice && Number(product.originalPrice) > 0 && (
                                <span className={styles.originalPrice}>Rs. {Number(product.originalPrice).toLocaleString()}</span>
                            )}
                        </div>

                        <p className={styles.description}>{product.description}</p>

                        <div className={styles.actionButtons}>
                            <button
                                className={styles.buyNowBtn}
                                onClick={() => {
                                    addToCart({ ...product, price: Number(product.price), id: product.id });
                                    window.location.href = '/checkout';
                                }}
                            >
                                Buy Now - Rs. {Number(product.price).toLocaleString()}
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
                            <h3>Olfactory Pyramid</h3>
                            <div className={styles.pyramidContainer}>
                                <div className={`${styles.pyramidTier} ${styles.tierTop}`}>
                                    <div className={styles.tierGlass}>
                                        <span className={styles.tierName}>TOP NOTES</span>
                                        <div className={styles.tierValue}>
                                            {topNotesList.map(note => (
                                                <button
                                                    key={note}
                                                    onClick={() => setActiveNote(activeNote === note ? null : note)}
                                                    className={`${styles.notePill} ${activeNote === note ? styles.activeNotePill : ''}`}
                                                >
                                                    {note}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles.pyramidTier} ${styles.tierHeart}`}>
                                    <div className={styles.tierGlass}>
                                        <span className={styles.tierName}>HEART NOTES</span>
                                        <div className={styles.tierValue}>
                                            {heartNotesList.map(note => (
                                                <button
                                                    key={note}
                                                    onClick={() => setActiveNote(activeNote === note ? null : note)}
                                                    className={`${styles.notePill} ${activeNote === note ? styles.activeNotePill : ''}`}
                                                >
                                                    {note}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={`${styles.pyramidTier} ${styles.tierBase}`}>
                                    <div className={styles.tierGlass}>
                                        <span className={styles.tierName}>BASE NOTES</span>
                                        <div className={styles.tierValue}>
                                            {baseNotesList.map(note => (
                                                <button
                                                    key={note}
                                                    onClick={() => setActiveNote(activeNote === note ? null : note)}
                                                    className={`${styles.notePill} ${activeNote === note ? styles.activeNotePill : ''}`}
                                                >
                                                    {note}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Active Scent Note Detail Box */}
                            <div className={styles.noteDetailContainer}>
                                {activeNote ? (
                                    <div className={`${styles.noteDetailCard} animateFadeInUp`}>
                                        <div className={styles.noteDetailHeader}>
                                            <h4 className={styles.noteDetailTitle}>{activeNote}</h4>
                                            <button className={styles.noteDetailClose} onClick={() => setActiveNote(null)}>&times;</button>
                                        </div>
                                        <p className={styles.noteDetailDesc}>
                                            {scentDescriptions[activeNote] || `${activeNote} is a premium fragrance note that adds depth and character to this luxury blend.`}
                                        </p>
                                    </div>
                                ) : (
                                    <div className={styles.noteDetailPlaceholder}>
                                        <span>🌿 Tap any note inside the pyramid to explore its scent profile details.</span>
                                    </div>
                                )}
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
                            {!session ? (
                                <p className={styles.reviewNotice} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Please <Link href="/login" style={{ textDecoration: 'underline', color: 'var(--accent)' }}>sign in</Link> and purchase this fragrance to leave a review.
                                </p>
                            ) : !hasPurchased ? (
                                <p className={styles.reviewNotice} style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                                    Only verified buyers who have purchased this fragrance from Owner Scents can leave an appraisal.
                                </p>
                            ) : (
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
                            )}
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

            {/* Sticky Mobile Buy Now Bar */}
            <div className={`${styles.stickyBar} ${showStickyBar ? styles.stickyBarOpen : ''}`}>
                <div className={styles.stickyBarContainer}>
                    <div className={styles.stickyBarLeft}>
                        {product.image && <img src={product.image} alt={product.name} className={styles.stickyBarImg} />}
                        <div className={styles.stickyBarInfo}>
                            <span className={styles.stickyBarName}>{product.name}</span>
                            <span className={styles.stickyBarPrice}>
                                <span className={styles.salePrice} style={{ color: '#f472b6', fontWeight: 600 }}>Rs. {Number(product.price).toLocaleString()}</span>
                                {product.originalPrice && Number(product.originalPrice) > 0 && (
                                    <span className={styles.originalPrice} style={{ textDecoration: 'line-through', opacity: 0.55, marginLeft: '0.5rem', fontSize: '0.75rem' }}>Rs. {Number(product.originalPrice).toLocaleString()}</span>
                                )}
                            </span>
                        </div>
                    </div>
                    <div className={styles.stickyBarRight}>
                        <button
                            className={`${styles.stickyBuyBtn} sheenEffect`}
                            onClick={() => {
                                addToCart({ ...product, price: Number(product.price), id: product.id });
                                window.location.href = '/checkout';
                            }}
                        >
                            Buy Now
                        </button>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
