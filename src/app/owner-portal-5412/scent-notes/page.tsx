'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

type ScentNote = {
    id: string;
    name: string;
    description: string;
    createdAt: string;
};

export default function AdminScentNotes() {
    const [scentNotes, setScentNotes] = useState<ScentNote[]>([]);
    const [loading, setLoading] = useState(true);
    const [newName, setNewName] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    // Editing states
    const [editingNote, setEditingNote] = useState<ScentNote | null>(null);
    const [editName, setEditName] = useState('');
    const [editDescription, setEditDescription] = useState('');
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const fetchScentNotes = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/admin/scent-notes');
            if (res.ok) {
                const data = await res.json();
                setScentNotes(data);
            } else {
                throw new Error('Failed to fetch scent notes');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load scent notes.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchScentNotes();
    }, []);

    const openEditModal = (note: ScentNote) => {
        setEditingNote(note);
        setEditName(note.name);
        setEditDescription(note.description);
        setError('');
        setIsEditModalOpen(true);
    };

    const handleEditNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editName.trim() || !editDescription.trim() || !editingNote) return;

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch(`/api/admin/scent-notes/${editingNote.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    name: editName, 
                    description: editDescription 
                })
            });

            if (res.ok) {
                setIsEditModalOpen(false);
                setEditingNote(null);
                fetchScentNotes();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to update scent note.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newName.trim() || !newDescription.trim()) return;

        setSubmitting(true);
        setError('');

        try {
            const res = await fetch('/api/admin/scent-notes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newName, description: newDescription })
            });

            if (res.ok) {
                setNewName('');
                setNewDescription('');
                fetchScentNotes();
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to add scent note.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDeleteNote = async (id: string) => {
        if (!confirm('Are you sure you want to delete this scent note description?')) return;

        try {
            const res = await fetch(`/api/admin/scent-notes/${id}`, {
                method: 'DELETE'
            });

            if (res.ok) {
                fetchScentNotes();
            } else {
                alert('Failed to delete scent note.');
            }
        } catch (err) {
            console.error(err);
            alert('Failed to delete scent note.');
        }
    };

    if (loading) return <div>Loading Scent Notes...</div>;

    return (
        <div>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Scent Notes</h1>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem', alignItems: 'start' }}>
                
                {/* Form Card */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px' }}>
                    <h3 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        Add Scent Note
                    </h3>

                    <form onSubmit={handleAddNote}>
                        {error && <div style={{ color: '#ef4444', background: '#ef44440d', padding: '0.75rem', border: '1px solid #ef4444', marginBottom: '1rem', fontSize: '0.85rem', borderRadius: '4px' }}>{error}</div>}

                        <div className={styles.formGroup}>
                            <label className={styles.label}>Note Name *</label>
                            <input 
                                type="text"
                                placeholder="e.g. Bergamot, Jasmine, Oud"
                                value={newName}
                                onChange={(e) => setNewName(e.target.value)}
                                className={styles.input}
                                required
                            />
                        </div>

                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label className={styles.label}>Description *</label>
                            <textarea 
                                placeholder="Describe the note's characteristics, olfactory profile, etc."
                                value={newDescription}
                                onChange={(e) => setNewDescription(e.target.value)}
                                className={styles.textarea}
                                rows={4}
                                required
                            />
                        </div>

                        <button 
                            type="submit" 
                            className={styles.btnPrimary} 
                            style={{ width: '100%', marginTop: '1rem' }}
                            disabled={submitting}
                        >
                            {submitting ? 'Adding...' : 'Add Scent Note'}
                        </button>
                    </form>
                </div>

                {/* List Table */}
                <div>
                    <h3 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.1rem', letterSpacing: '1px', marginBottom: '1rem' }}>
                        Registered Note Descriptions ({scentNotes.length})
                    </h3>

                    <div className={styles.tableWrapper} style={{ marginTop: '0' }}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th} style={{ width: '25%' }}>Note Name</th>
                                    <th className={styles.th} style={{ width: '55%' }}>Description</th>
                                    <th className={styles.th} style={{ textAlign: 'right', width: '20%' }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {scentNotes.length === 0 ? (
                                    <tr>
                                        <td className={styles.td} colSpan={3} style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>
                                            No notes found. Seed them via storefront or create one on the left!
                                        </td>
                                    </tr>
                                ) : (
                                    scentNotes.map((note) => (
                                        <tr key={note.id} className={styles.tr}>
                                            <td className={styles.td} style={{ fontWeight: '600', color: 'var(--accent)' }}>{note.name}</td>
                                            <td className={styles.td} style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{note.description}</td>
                                            <td className={styles.td} style={{ textAlign: 'right' }}>
                                                <button 
                                                    onClick={() => openEditModal(note)}
                                                    className={styles.btnSecondary}
                                                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', marginRight: '0.5rem' }}
                                                >
                                                    Edit
                                                </button>
                                                <button 
                                                    onClick={() => handleDeleteNote(note.id)}
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

            {/* Edit Scent Note Modal */}
            {isEditModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent} style={{ maxWidth: '500px' }}>
                        <div className={styles.modalHeader}>
                            <h2 className={styles.modalTitle}>Edit Scent Note</h2>
                            <button onClick={() => setIsEditModalOpen(false)} className={styles.modalClose}>
                                &times;
                            </button>
                        </div>

                        <form onSubmit={handleEditNote}>
                            {error && <div style={{ color: '#ef4444', marginBottom: '1rem', fontSize: '0.85rem' }}>{error}</div>}

                            <div className={styles.formGroup}>
                                <label className={styles.label}>Note Name *</label>
                                <input 
                                    type="text" 
                                    value={editName} 
                                    onChange={(e) => setEditName(e.target.value)} 
                                    className={styles.input}
                                    required 
                                />
                            </div>

                            <div className={styles.formGroup} style={{ marginTop: '1.25rem' }}>
                                <label className={styles.label}>Description *</label>
                                <textarea 
                                    value={editDescription} 
                                    onChange={(e) => setEditDescription(e.target.value)} 
                                    className={styles.textarea}
                                    rows={4}
                                    required 
                                />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem' }}>
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
                                    {submitting ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
