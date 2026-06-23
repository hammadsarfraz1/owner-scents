'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

type HomepageConfig = {
    card1Name: string;
    card1Edition: string;
    card1Image: string;
    card1Link: string;
    card2Name: string;
    card2Edition: string;
    card2Image: string;
    card2Link: string;
    card3Name: string;
    card3Edition: string;
    card3Image: string;
    card3Link: string;
    split1Title: string;
    split1Image: string;
    split1Link: string;
    split2Title: string;
    split2Image: string;
    split2Link: string;
};

export default function EditHomepage() {
    const [config, setConfig] = useState<HomepageConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // State fields for the form
    const [card1Name, setCard1Name] = useState('');
    const [card1Edition, setCard1Edition] = useState('');
    const [card1Image, setCard1Image] = useState('');
    const [card1Link, setCard1Link] = useState('');

    const [card2Name, setCard2Name] = useState('');
    const [card2Edition, setCard2Edition] = useState('');
    const [card2Image, setCard2Image] = useState('');
    const [card2Link, setCard2Link] = useState('');

    const [card3Name, setCard3Name] = useState('');
    const [card3Edition, setCard3Edition] = useState('');
    const [card3Image, setCard3Image] = useState('');
    const [card3Link, setCard3Link] = useState('');

    const [split1Title, setSplit1Title] = useState('');
    const [split1Image, setSplit1Image] = useState('');
    const [split1Link, setSplit1Link] = useState('');

    const [split2Title, setSplit2Title] = useState('');
    const [split2Image, setSplit2Image] = useState('');
    const [split2Link, setSplit2Link] = useState('');

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/homepage-config');
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
                
                // Initialize states
                setCard1Name(data.card1Name);
                setCard1Edition(data.card1Edition);
                setCard1Image(data.card1Image);
                setCard1Link(data.card1Link);

                setCard2Name(data.card2Name);
                setCard2Edition(data.card2Edition);
                setCard2Image(data.card2Image);
                setCard2Link(data.card2Link);

                setCard3Name(data.card3Name);
                setCard3Edition(data.card3Edition);
                setCard3Image(data.card3Image);
                setCard3Link(data.card3Link);

                setSplit1Title(data.split1Title);
                setSplit1Image(data.split1Image);
                setSplit1Link(data.split1Link);

                setSplit2Title(data.split2Title);
                setSplit2Image(data.split2Image);
                setSplit2Link(data.split2Link);
            } else {
                throw new Error('Failed to load configuration');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load homepage configuration.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        const payload = {
            card1Name, card1Edition, card1Image, card1Link,
            card2Name, card2Edition, card2Image, card2Link,
            card3Name, card3Edition, card3Image, card3Link,
            split1Title, split1Image, split1Link,
            split2Title, split2Image, split2Link
        };

        try {
            const res = await fetch('/api/admin/homepage-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccess('Homepage configuration updated successfully!');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save configuration.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading Configuration...</div>;

    return (
        <div style={{ maxWidth: '1000px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Edit Homepage</h1>

            {error && <div style={{ color: '#ef4444', background: '#ef44440d', padding: '1rem', border: '1px solid #ef4444', marginBottom: '1.5rem', borderRadius: '4px' }}>{error}</div>}
            {success && <div style={{ color: '#10b981', background: '#10b9810d', padding: '1rem', border: '1px solid #10b981', marginBottom: '1.5rem', borderRadius: '4px' }}>{success}</div>}

            <form onSubmit={handleSubmit}>
                
                {/* 3D Stack Cards Configuration */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        3D Card Stack (Showcase)
                    </h2>

                    {/* Card 1 (Left) */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Card 1 (Left Position)</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name *</label>
                                <input type="text" value={card1Name} onChange={(e) => setCard1Name(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Edition / Subtitle *</label>
                                <input type="text" value={card1Edition} onChange={(e) => setCard1Edition(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={card1Image} onChange={(e) => setCard1Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link / Page URL *</label>
                                <input type="text" value={card1Link} onChange={(e) => setCard1Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>

                    {/* Card 2 (Center) */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Card 2 (Center Focus Position)</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name *</label>
                                <input type="text" value={card2Name} onChange={(e) => setCard2Name(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Edition / Subtitle *</label>
                                <input type="text" value={card2Edition} onChange={(e) => setCard2Edition(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={card2Image} onChange={(e) => setCard2Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link / Page URL *</label>
                                <input type="text" value={card2Link} onChange={(e) => setCard2Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>

                    {/* Card 3 (Right) */}
                    <div style={{ paddingBottom: '0.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Card 3 (Right Position)</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name *</label>
                                <input type="text" value={card3Name} onChange={(e) => setCard3Name(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Edition / Subtitle *</label>
                                <input type="text" value={card3Edition} onChange={(e) => setCard3Edition(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={card3Image} onChange={(e) => setCard3Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link / Page URL *</label>
                                <input type="text" value={card3Link} onChange={(e) => setCard3Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Categories Splits Configuration */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        Categories splits (Him / Her)
                    </h2>

                    {/* Split 1 (Left - Him) */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Left split (For Him)</h4>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Title *</label>
                            <input type="text" value={split1Title} onChange={(e) => setSplit1Title(e.target.value)} className={styles.input} required />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={split1Image} onChange={(e) => setSplit1Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link *</label>
                                <input type="text" value={split1Link} onChange={(e) => setSplit1Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>

                    {/* Split 2 (Right - Her) */}
                    <div>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Right split (For Her)</h4>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Title *</label>
                            <input type="text" value={split2Title} onChange={(e) => setSplit2Title(e.target.value)} className={styles.input} required />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={split2Image} onChange={(e) => setSplit2Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link *</label>
                                <input type="text" value={split2Link} onChange={(e) => setSplit2Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="submit" className={styles.btnPrimary} style={{ padding: '0.8rem 2rem' }} disabled={submitting}>
                        {submitting ? 'Saving Configurations...' : 'Save Configurations'}
                    </button>
                </div>
            </form>
        </div>
    );
}
