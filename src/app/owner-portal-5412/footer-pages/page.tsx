'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

type InfoPage = {
    id: string;
    slug: string;
    title: string;
    content: string;
    isVisible: boolean;
    createdAt: string;
};

export default function AdminFooterPages() {
    const [pages, setPages] = useState<InfoPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Form inputs for creating a new page
    const [newTitle, setNewTitle] = useState('');
    const [newSlug, setNewSlug] = useState('');
    const [newContent, setNewContent] = useState('');
    const [newIsVisible, setNewIsVisible] = useState(true);

    // Editing states
    const [editingPage, setEditingPage] = useState<InfoPage | null>(null);
    const [editTitle, setEditTitle] = useState('');
    const [editSlug, setEditSlug] = useState('');
    const [editContent, setEditContent] = useState('');
    const [editIsVisible, setEditIsVisible] = useState(true);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchPages = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/footer-pages');
            if (res.ok) {
                const data = await res.json();
                setPages(data);
            } else {
                throw new Error('Failed to fetch pages');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load pages.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPages();
    }, []);

    const openEditModal = (page: InfoPage) => {
        setEditingPage(page);
        setEditTitle(page.title);
        setEditSlug(page.slug);
        setEditContent(page.content);
        setEditIsVisible(page.isVisible);
        setError('');
        setIsEditModalOpen(true);
    };

    const handleEditPage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editTitle.trim() || !editSlug.trim() || !editContent.trim() || !editingPage) return;

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/footer-pages/${editingPage.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: editTitle,
                    slug: editSlug,
                    content: editContent,
                    isVisible: editIsVisible
                })
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                setEditingPage(null);
                fetchPages();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update page.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddPage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newTitle.trim() || !newSlug.trim() || !newContent.trim()) return;

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/admin/footer-pages', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    title: newTitle,
                    slug: newSlug,
                    content: newContent,
                    isVisible: newIsVisible
                })
            });

            if (res.ok) {
                setNewTitle('');
                setNewSlug('');
                setNewContent('');
                setNewIsVisible(true);
                fetchPages();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to add page.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeletePage = async (id: string) => {
        if (!confirm('Are you sure you want to delete this footer page? This action cannot be undone.')) return;

        try {
            const res = await fetch(`/api/admin/footer-pages/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchPages();
            } else {
                alert('Failed to delete page.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete page.');
        }
    };

    const handleToggleVisibility = async (page: InfoPage) => {
        const nextState = !page.isVisible;
        try {
            const res = await fetch(`/api/admin/footer-pages/${page.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isVisible: nextState })
            });

            if (res.ok) {
                fetchPages();
            } else {
                alert('Failed to toggle page visibility.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to toggle page visibility.');
        }
    };

    if (loading) return <div>Loading Footer Pages...</div>;

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Footer Pages</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
                
                {/* Add Page Form */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        Add New Page
                    </h3>

                    <form onSubmit={handleAddPage}>
                        {error && <div style={{ color: '#ef4444', background: '#ef44440d', padding: '0.75rem', border: '1px solid #ef4444', marginBottom: '1rem', fontSize: '0.85rem', borderRadius: '4px' }}>{error}</div>}

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Page Title *</label>
                            <input 
                                type="text"
                                placeholder="e.g. Terms of Service"
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label className={styles.label}>Slug *</label>
                            <input 
                                type="text"
                                placeholder="e.g. terms-of-service"
                                value={newSlug}
                                onChange={(e) => setNewSlug(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label className={styles.label}>Content *</label>
                            <textarea 
                                placeholder="Write page content here..."
                                value={newContent}
                                onChange={(e) => setNewContent(e.target.value)}
                                className={styles.input}
                                style={{ minHeight: '200px', resize: 'vertical', fontFamily: 'inherit' }}
                                required
                            />
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1.5rem 0 1rem' }}>
                            <input 
                                type="checkbox" 
                                id="newIsVisible" 
                                checked={newIsVisible} 
                                onChange={(e) => setNewIsVisible(e.target.checked)} 
                                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                            />
                            <label htmlFor="newIsVisible" style={{ cursor: 'pointer', fontSize: '0.88rem', fontWeight: '500' }}>
                                Visible in Footer
                            </label>
                        </div>

                        <button 
                            type="submit" 
                            className={styles.btnPrimary} 
                            style={{ width: '100%', marginTop: '0.5rem' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Adding...' : 'Create Page'}
                        </button>
                    </form>
                </div>

                {/* List Table */}
                <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '1rem' }}>
                        Active Footer Pages ({pages.length})
                    </h3>

                    <div className={styles.tableWrapper} style={{ marginTop: '0' }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Page Title</th>
                                    <th className={styles.th}>Slug</th>
                                    <th className={styles.th}>Status</th>
                                    <th className={styles.th} style={{ textAlign: 'right' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pages.length === 0 ? (
                                    <tr>
                                        <td className={styles.td} colSpan={4} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            No pages found. Create one on the left!
                                        </td>
                                    </tr>
                                ) : (
                                    pages.map((p) => (
                                        <tr key={p.id} className={styles.tr}>
                                            <td className={styles.td} style={{ fontWeight: '500' }}>{p.title}</td>
                                            <td className={styles.td} style={{ fontStyle: 'italic', color: 'var(--accent)' }}>/{p.slug}</td>
                                            <td className={styles.td}>
                                                <button 
                                                    onClick={() => handleToggleVisibility(p)}
                                                    style={{ 
                                                        background: p.isVisible ? '#10b9810d' : '#ef44440d',
                                                        color: p.isVisible ? '#10b981' : '#ef4444',
                                                        border: `1px solid ${p.isVisible ? '#10b981' : '#ef4444'}`,
                                                        padding: '0.25rem 0.5rem',
                                                        borderRadius: '4px',
                                                        fontSize: '0.72rem',
                                                        cursor: 'pointer',
                                                        fontWeight: 500
                                                    }}
                                                >
                                                    {p.isVisible ? 'Visible' : 'Hidden'}
                                                </button>
                                            </td>
                                            <td className={styles.td} style={{ textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => openEditModal(p)}
                                                    className={styles.btnSecondary}
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeletePage(p.id)}
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

            {/* Edit Page Modal */}
            {isEditModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '650px' }}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Edit Page</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className={styles.modalClose}>
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleEditPage}>
                            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Page Title *</label>
                                <input 
                                    type="text" 
                                    value={editTitle} 
                                    onChange={(e) => setEditTitle(e.target.value)} 
                                    className={styles.input}
                                    required 
                                />
                            </div>

                            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                                <label className={styles.label}>Slug *</label>
                                <input 
                                    type="text" 
                                    value={editSlug} 
                                    onChange={(e) => setEditSlug(e.target.value)} 
                                    className={styles.input}
                                    required 
                                />
                            </div>

                            <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                                <label className={styles.label}>Content *</label>
                                <textarea 
                                    value={editContent} 
                                    onChange={(e) => setEditContent(e.target.value)} 
                                    className={styles.input}
                                    style={{ minHeight: '300px', resize: 'vertical', fontFamily: 'inherit' }}
                                    required 
                                />
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', marginTop: '1rem' }}>
                                <input 
                                    type="checkbox" 
                                    id="editIsVisible" 
                                    checked={editIsVisible} 
                                    onChange={(e) => setEditIsVisible(e.target.checked)} 
                                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                                />
                                <label htmlFor="editIsVisible" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>
                                    Visible in Footer (Check to show, uncheck to hide)
                                </label>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                                <button 
                                    type="button" 
                                    onClick={() => setIsEditModalOpen(false)} 
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
                                    {submitting ? 'Saving...' : 'Save Page'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
