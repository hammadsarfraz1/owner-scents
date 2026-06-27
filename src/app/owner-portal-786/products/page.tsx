'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

type Product = {
    id: string;
    name: string;
    description: string;
    price: string;
    originalPrice: string | null;
    isVisible: boolean;
    isExclusiveOffer?: boolean;
    image: string;
    homepageImage?: string;
    quickViewImage?: string;
    image2?: string;
    image3?: string;
    slug: string;
    gender: string;
    category: string;
    topNotes: string;
    heartNotes: string;
    baseNotes: string;
};

type Category = {
    id: string;
    name: string;
};

export default function AdminProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Form fields
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [originalPrice, setOriginalPrice] = useState('');
    const [isVisible, setIsVisible] = useState(true);
    const [isExclusiveOffer, setIsExclusiveOffer] = useState(false);
    const [image, setImage] = useState('');
    const [homepageImage, setHomepageImage] = useState('');
    const [quickViewImage, setQuickViewImage] = useState('');
    const [image2, setImage2] = useState('');
    const [image3, setImage3] = useState('');
    const [gender, setGender] = useState('Unisex');
    const [category, setCategory] = useState('');
    const [topNotes, setTopNotes] = useState('');
    const [heartNotes, setHeartNotes] = useState('');
    const [baseNotes, setBaseNotes] = useState('');

    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    const fetchData = async () => {
        try {
            setLoading(true);
            const [productsRes, categoriesRes] = await Promise.all([
                fetch('/api/admin/products'),
                fetch('/api/admin/categories')
            ]);

            if (productsRes.ok && categoriesRes.ok) {
                const productsData = await productsRes.json();
                const categoriesData = await categoriesRes.json();
                setProducts(productsData);
                setCategories(categoriesData);

                // Set default category for the form
                if (categoriesData.length > 0) {
                    setCategory(categoriesData[0].name);
                }
            } else {
                throw new Error('Failed to fetch products or categories');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load dashboard data.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const openAddModal = () => {
        setEditingProduct(null);
        setName('');
        setDescription('');
        setPrice('');
        setOriginalPrice('');
        setIsVisible(true);
        setIsExclusiveOffer(false);
        setImage('');
        setHomepageImage('');
        setQuickViewImage('');
        setImage2('');
        setImage3('');
        setGender('Unisex');
        if (categories.length > 0) {
            setCategory(categories[0].name);
        } else {
            setCategory('Signature');
        }
        setTopNotes('');
        setHeartNotes('');
        setBaseNotes('');
        setError('');
        setIsModalOpen(true);
    };

    const openEditModal = (product: Product) => {
        setEditingProduct(product);
        setName(product.name);
        setDescription(product.description);
        setPrice(Number(product.price).toString());
        setOriginalPrice(product.originalPrice ? Number(product.originalPrice).toString() : '');
        setIsVisible(product.isVisible !== undefined ? Boolean(product.isVisible) : true);
        setIsExclusiveOffer(Boolean(product.isExclusiveOffer));
        setImage(product.image);
        setHomepageImage(product.homepageImage || '');
        setQuickViewImage(product.quickViewImage || '');
        setImage2(product.image2 || '');
        setImage3(product.image3 || '');
        setGender(product.gender);
        setCategory(product.category);
        setTopNotes(product.topNotes);
        setHeartNotes(product.heartNotes);
        setBaseNotes(product.baseNotes);
        setError('');
        setIsModalOpen(true);
    };

    const handleToggleExclusive = async (product: Product) => {
        const nextState = !product.isExclusiveOffer;
        try {
            const res = await fetch(`/api/admin/products/${product.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isExclusiveOffer: nextState })
            });
            if (res.ok) {
                fetchData();
            } else {
                alert('Failed to update Exclusive Offer status.');
            }
        } catch (err) {
            console.error(err);
            alert('Error updating product.');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');

        if (!name || !description || !price || !image) {
            setError('Please fill in all required fields.');
            setSubmitting(false);
            return;
        }

        const payload = {
            name,
            description,
            price: Number(price),
            originalPrice: originalPrice ? Number(originalPrice) : null,
            isVisible: Boolean(isVisible),
            isExclusiveOffer: Boolean(isExclusiveOffer),
            image,
            homepageImage,
            quickViewImage,
            image2,
            image3,
            gender,
            category,
            topNotes,
            heartNotes,
            baseNotes
        };

        try {
            const url = editingProduct 
                ? `/api/admin/products/${editingProduct.id}` 
                : '/api/admin/products';
            const method = editingProduct ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setIsModalOpen(false);
                fetchData();
            } else {
                const data = await res.json();
                setError(data.error || 'Something went wrong.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this fragrance?')) return;

        try {
            const res = await fetch(`/api/admin/products/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchData();
            } else {
                alert('Failed to delete product.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete product.');
        }
    };

    if (loading) return <div>Loading Products...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem' }}>Fragrances</h1>
                <button onClick={openAddModal} className={styles.btnPrimary}>
                    + Add Fragrance
                </button>
            </div>

            {error && <div style={{ color: '#ef4444', background: '#ef44440d', padding: '1rem', border: '1px solid #ef4444', marginBottom: '1.5rem', borderRadius: '4px' }}>{error}</div>}

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th className={styles.th}>Image</th>
                            <th className={styles.th}>Name</th>
                            <th className={styles.th}>Category</th>
                            <th className={styles.th}>Gender</th>
                            <th className={styles.th}>Price</th>
                            <th className={styles.th}>Visibility</th>
                            <th className={styles.th}>Exclusive Offer</th>
                            <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.length === 0 ? (
                            <tr>
                                <td className={styles.td} colSpan={8} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No products found. Add your first fragrance!
                                </td>
                            </tr>
                        ) : (
                            products.map((product) => (
                                <tr key={product.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <img 
                                            src={product.image} 
                                            alt={product.name} 
                                            style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                        />
                                    </td>
                                    <td className={styles.td} style={{ fontWeight: '500' }}>{product.name}</td>
                                    <td className={styles.td}>{product.category}</td>
                                    <td className={styles.td}>{product.gender}</td>
                                    <td className={styles.td}>
                                        <div>Rs. {Number(product.price).toLocaleString()}</div>
                                        {product.originalPrice && Number(product.originalPrice) > 0 && (
                                            <div style={{ textDecoration: 'line-through', opacity: 0.5, fontSize: '0.72rem' }}>
                                                Rs. {Number(product.originalPrice).toLocaleString()}
                                            </div>
                                        )}
                                    </td>
                                    <td className={styles.td}>
                                        {product.isVisible ? (
                                            <span style={{ color: '#10b981', background: '#10b9810d', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', border: '1px solid #10b981' }}>Visible</span>
                                        ) : (
                                            <span style={{ color: '#9ca3af', background: '#9ca3af0d', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.72rem', border: '1px solid #9ca3af' }}>Hidden</span>
                                        )}
                                    </td>
                                    <td className={styles.td}>
                                        <button
                                            onClick={() => handleToggleExclusive(product)}
                                            style={{
                                                background: product.isExclusiveOffer ? 'rgba(197, 160, 89, 0.15)' : 'transparent',
                                                color: product.isExclusiveOffer ? 'var(--accent)' : 'var(--text-tertiary)',
                                                border: product.isExclusiveOffer ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                                                padding: '0.25rem 0.65rem',
                                                borderRadius: '20px',
                                                fontSize: '0.72rem',
                                                fontWeight: '600',
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                        >
                                            {product.isExclusiveOffer ? '⭐ In Exclusive List' : '+ Add to Exclusive'}
                                        </button>
                                    </td>
                                    <td className={styles.td} style={{ textAlign: 'right' }}>
                                        <button 
                                            onClick={() => openEditModal(product)} 
                                            className={styles.btnSecondary}
                                            style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                                        >
                                            Edit
                                        </button>
                                        <button 
                                            onClick={() => handleDelete(product.id)} 
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

            {/* Glassmorphic Modal Form */}
            {isModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>
                                {editingProduct ? 'Edit Fragrance' : 'New Fragrance'}
                            </h2>
                            <button onClick={() => setIsModalOpen(false)} className={styles.modalClose}>
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name *</label>
                                <input 
                                    type="text" 
                                    value={name} 
                                    onChange={(e) => setName(e.target.value)} 
                                    className={styles.input}
                                    required 
                                />
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Price (PKR) *</label>
                                    <input 
                                        type="number" 
                                        value={price} 
                                        onChange={(e) => setPrice(e.target.value)} 
                                        className={styles.input}
                                        required 
                                    />
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Original Cut Price (PKR) (Optional)</label>
                                    <input 
                                        type="number" 
                                        value={originalPrice} 
                                        onChange={(e) => setOriginalPrice(e.target.value)} 
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Description *</label>
                                <textarea 
                                    value={description} 
                                    onChange={(e) => setDescription(e.target.value)} 
                                    className={styles.textarea}
                                    rows={3}
                                    required 
                                />
                            </div>

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL (Detail Page Main View) *</label>
                                <input 
                                    type="text" 
                                    value={image} 
                                    onChange={(e) => setImage(e.target.value)} 
                                    placeholder="High-res portrait preview"
                                    className={styles.input}
                                    required 
                                />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.label}>Homepage Card Image URL (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={homepageImage} 
                                        onChange={(e) => setHomepageImage(e.target.value)} 
                                        placeholder="Card sized view"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.label}>QuickView Image URL (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={quickViewImage} 
                                        onChange={(e) => setQuickViewImage(e.target.value)} 
                                        placeholder="QuickView modal view"
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.label}>Gallery Image URL 2 (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={image2} 
                                        onChange={(e) => setImage2(e.target.value)} 
                                        placeholder="Secondary detail view"
                                        className={styles.input}
                                    />
                                </div>
                                <div className={styles.formGroup} style={{ marginBottom: 0 }}>
                                    <label className={styles.label}>Gallery Image URL 3 (Optional)</label>
                                    <input 
                                        type="text" 
                                        value={image3} 
                                        onChange={(e) => setImage3(e.target.value)} 
                                        placeholder="Box packaging / alternative view"
                                        className={styles.input}
                                    />
                                </div>
                            </div>

                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Gender</label>
                                    <select 
                                        value={gender} 
                                        onChange={(e) => setGender(e.target.value)} 
                                        className={styles.select}
                                    >
                                        <option value="Men">Men</option>
                                        <option value="Women">Women</option>
                                        <option value="Unisex">Unisex</option>
                                    </select>
                                </div>

                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Category</label>
                                    <select 
                                        value={category} 
                                        onChange={(e) => setCategory(e.target.value)} 
                                        className={styles.select}
                                    >
                                        {categories.length === 0 ? (
                                            <option value="Signature">Signature</option>
                                        ) : (
                                            categories.map(c => (
                                                <option key={c.id} value={c.name}>{c.name}</option>
                                            ))
                                        )}
                                    </select>
                                </div>
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem', background: 'var(--bg-tertiary)', padding: '1rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input 
                                        type="checkbox" 
                                        id="isVisible" 
                                        checked={isVisible} 
                                        onChange={(e) => setIsVisible(e.target.checked)} 
                                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                    />
                                    <label htmlFor="isVisible" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>
                                        Visible on storefront (Check to show, uncheck to hide)
                                    </label>
                                </div>
                                
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                    <input 
                                        type="checkbox" 
                                        id="isExclusiveOffer" 
                                        checked={isExclusiveOffer} 
                                        onChange={(e) => setIsExclusiveOffer(e.target.checked)} 
                                        style={{ width: '18px', height: '18px', cursor: 'pointer', accentColor: 'var(--accent)' }}
                                    />
                                    <label htmlFor="isExclusiveOffer" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '600', color: 'var(--accent)' }}>
                                        ⭐ Add to Exclusive Offer List (Featured on Homepage Limited-Time Sale)
                                    </label>
                                </div>
                            </div>

                            <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                                <h4 style={{ textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--accent)' }}>Notes Profile</h4>
                                
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Top Notes</label>
                                        <input 
                                            type="text" 
                                            value={topNotes} 
                                            onChange={(e) => setTopNotes(e.target.value)} 
                                            placeholder="e.g. Lemon, Mint"
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Heart Notes</label>
                                        <input 
                                            type="text" 
                                            value={heartNotes} 
                                            onChange={(e) => setHeartNotes(e.target.value)} 
                                            placeholder="e.g. Rose, Jasmine"
                                            className={styles.input}
                                        />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Base Notes</label>
                                        <input 
                                            type="text" 
                                            value={baseNotes} 
                                            onChange={(e) => setBaseNotes(e.target.value)} 
                                            placeholder="e.g. Vanilla, Musk"
                                            className={styles.input}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setIsModalOpen(false)} 
                                    className={styles.btnSecondary}
                                    disabled={submitting}
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit" 
                                    className={styles.btnPrimary}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Saving...' : 'Save Product'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
