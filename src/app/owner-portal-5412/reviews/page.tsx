'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

type Review = {
    id: string;
    name: string;
    rating: number;
    comment: string;
    date: string;
    productId: string;
    product: {
        name: string;
    };
};

export default function AdminReviews() {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/reviews');
            if (res.ok) {
                const data = await res.json();
                setReviews(data);
            } else {
                throw new Error('Failed to fetch reviews');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load reviews.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleDeleteReview = async (id: string) => {
        if (!confirm('Are you sure you want to delete this customer review?')) return;

        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchReviews();
            } else {
                alert('Failed to delete review.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete review.');
        }
    };

    if (loading) return <div>Loading Reviews...</div>;

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Reviews Moderation</h1>

            {error && <div style={{ color: '#ef4444', background: '#ef44440d', padding: '1rem', border: '1px solid #ef4444', marginBottom: '1.5rem', borderRadius: '4px' }}>{error}</div>}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th} style={{ width: '20%' }}>Product</th>
                            <th className={styles.th} style={{ width: '15%' }}>Reviewer</th>
                            <th className={styles.th} style={{ width: '15%' }}>Rating</th>
                            <th className={styles.th} style={{ width: '35%' }}>Comment</th>
                            <th className={styles.th} style={{ width: '10%' }}>Date</th>
                            <th className={styles.th} style={{ width: '5%', textAlign: 'right' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reviews.length === 0 ? (
                            <tr>
                                <td className={styles.td} colSpan={6} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No customer reviews found.
                                </td>
                            </tr>
                        ) : (
                            reviews.map((r) => (
                                <tr key={r.id} className={styles.tr}>
                                    <td className={styles.td} style={{ fontWeight: '500' }}>
                                        {r.product?.name || 'Deleted Product'}
                                    </td>
                                    <td className={styles.td}>{r.name}</td>
                                    <td className={styles.td} style={{ color: 'var(--accent)', fontWeight: '600' }}>
                                        {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}
                                    </td>
                                    <td className={styles.td} style={{ fontStyle: 'italic', fontSize: '0.85rem' }}>
                                        "{r.comment}"
                                    </td>
                                    <td className={styles.td}>{r.date}</td>
                                    <td className={styles.td} style={{ textAlign: 'right' }}>
                                        <button 
                                            onClick={() => handleDeleteReview(r.id)}
                                            className={styles.btnDanger}
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem' }}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
