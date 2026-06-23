'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

type Category = {
    id: string;
    name: string;
    createdAt: string;
};

export default function AdminCategories() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            } else {
                throw new Error('Failed to fetch categories');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load categories.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleAddCategory = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/admin/categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName })
            });

            if (res.ok) {
                setNewCategoryName('');
                fetchCategories();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to add category.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('Are you sure you want to delete this category? Products in this category will not be deleted, but the category option will be removed.')) return;

        try {
            const res = await fetch(`/api/admin/categories/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchCategories();
            } else {
                alert('Failed to delete category.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete category.');
        }
    };

    if (loading) return <div>Loading Categories...</div>;

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Categories</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
                
                {/* Form Card */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        Add Category
                    </h3>

                    <form onSubmit={handleAddCategory}>
                        {error && <div style={{ color: '#ef4444', background: '#ef44440d', padding: '0.75rem', border: '1px solid #ef4444', marginBottom: '1rem', fontSize: '0.85rem', borderRadius: '4px' }}>{error}</div>}

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Category Name *</label>
                            <input 
                                type="text"
                                placeholder="e.g. Woody, Spicy, Sweet"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.btnPrimary} 
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Adding...' : 'Add Category'}
                        </button>
                    </form>
                </div>

                {/* List Table */}
                <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '1rem' }}>
                        Active Categories ({categories.length})
                    </h3>

                    <div className={styles.tableWrapper} style={{ marginTop: '0' }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Category Name</th>
                                    <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {categories.length === 0 ? (
                                    <tr>
                                        <td className={styles.td} colSpan={2} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            No categories found. Create one on the left!
                                        </td>
                                    </tr>
                                ) : (
                                    categories.map((c) => (
                                        <tr key={c.id} className={styles.tr}>
                                            <td className={styles.td} style={{ fontWeight: '500' }}>{c.name}</td>
                                            <td className={styles.td} style={{ textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => handleDeleteCategory(c.id)}
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
            </div>
        </div>
    );
}
