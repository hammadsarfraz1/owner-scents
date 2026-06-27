'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

type Option = {
    text: string;
    value: string;
    description: string;
};

type Question = {
    id: number;
    text: string;
    options: Option[];
};

const defaultQuestions: Question[] = [
    {
        id: 1,
        text: "Which olfactory atmosphere speaks to your soul?",
        options: [
            { text: "Vibrant & Crisp", value: "Fresh", description: "Zesty citrus, marine breezes, clean linen." },
            { text: "Deep & Mysterious", value: "Woody", description: "Smoky resins, warm leather, ancient woods." },
            { text: "Sensual & Velvet", value: "Floral", description: "Blooming roses, black orchids, sweet vanilla." }
        ]
    },
    {
        id: 2,
        text: "When does your signature scent need to perform?",
        options: [
            { text: "Daytime Authority", value: "day", description: "Office meetings, casual gatherings, clean presence." },
            { text: "Night-time Command", value: "night", description: "VIP events, intimate dinners, bold projections." },
            { text: "All-Season Signature", value: "all", description: "Timeless versatility, adapting to your warmth." }
        ]
    },
    {
        id: 3,
        text: "What key note represents your personal authority?",
        options: [
            { text: "Leather & Agarwood (Oud)", value: "oud", description: "Opulent, dry, intense, authoritative." },
            { text: "Sea Salt & Fresh Herbs", value: "salt", description: "Brisk, clean, airy, energetic." },
            { text: "Red Rose & Honeyed Rum", value: "rose", description: "Rich, sweet, dark, seductive." }
        ]
    }
];

export default function EditScentFinder() {
    const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        fetch('/api/homepage-config')
            .then(res => res.json())
            .then(data => {
                if (data.scentFinderConfig) {
                    try {
                        const parsed = JSON.parse(data.scentFinderConfig);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setQuestions(parsed);
                        }
                    } catch (e) {
                        console.error("Could not parse scentFinderConfig", e);
                    }
                }
            })
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const handleQuestionTextChange = (qIdx: number, text: string) => {
        const updated = [...questions];
        updated[qIdx].text = text;
        setQuestions(updated);
    };

    const handleOptionChange = (qIdx: number, oIdx: number, field: keyof Option, value: string) => {
        const updated = [...questions];
        updated[qIdx].options[oIdx][field] = value;
        setQuestions(updated);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        try {
            const res = await fetch('/api/admin/homepage-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    scentFinderConfig: JSON.stringify(questions)
                })
            });

            if (res.ok) {
                setSuccess('Scent Finder Quiz questions updated successfully!');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save Scent Finder configuration.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div style={{ padding: '2rem' }}>Loading Quiz Questions...</div>;

    return (
        <div style={{ maxWidth: '1000px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '0.5rem' }}>Manage Scent Finder Quiz</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.9rem' }}>
                Customize the 3 interactive questions and option choices displayed on the live Scent Finder page (`/scent-finder`).
            </p>

            {error && <div style={{ color: '#ef4444', background: '#ef44440d', padding: '1rem', border: '1px solid #ef4444', marginBottom: '1.5rem', borderRadius: '4px' }}>{error}</div>}
            {success && <div style={{ color: '#10b981', background: '#10b9810d', padding: '1rem', border: '1px solid #10b981', marginBottom: '1.5rem', borderRadius: '4px' }}>{success}</div>}

            <form onSubmit={handleSubmit}>
                {questions.map((q, qIdx) => (
                    <div key={q.id} style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2rem' }}>
                        <h2 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.2rem', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--accent)' }}>
                            Question {qIdx + 1}
                        </h2>

                        <div className={styles.formGroup} style={{ marginBottom: '1.5rem' }}>
                            <label className={styles.label}>Question Title / Heading</label>
                            <input
                                type="text"
                                value={q.text}
                                onChange={(e) => handleQuestionTextChange(qIdx, e.target.value)}
                                className={styles.input}
                            />
                        </div>

                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
                            Answer Choices (Options)
                        </h4>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {q.options.map((opt, oIdx) => (
                                <div key={oIdx} style={{ background: 'var(--bg-tertiary)', padding: '1.25rem', borderRadius: '6px', border: '1px solid var(--border-color)' }}>
                                    <div style={{ fontWeight: 600, fontSize: '0.8rem', color: 'var(--accent-gold)', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                                        Choice {oIdx + 1}
                                    </div>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Choice Title</label>
                                            <input
                                                type="text"
                                                value={opt.text}
                                                onChange={(e) => handleOptionChange(qIdx, oIdx, 'text', e.target.value)}
                                                className={styles.input}
                                            />
                                        </div>
                                        <div className={styles.formGroup}>
                                            <label className={styles.label}>Match Value Tag (e.g. Fresh, Woody, Floral, day, night, oud, salt, rose)</label>
                                            <input
                                                type="text"
                                                value={opt.value}
                                                onChange={(e) => handleOptionChange(qIdx, oIdx, 'value', e.target.value)}
                                                className={styles.input}
                                            />
                                        </div>
                                    </div>
                                    <div className={styles.formGroup} style={{ marginTop: '0.5rem' }}>
                                        <label className={styles.label}>Choice Subtitle / Description</label>
                                        <input
                                            type="text"
                                            value={opt.description}
                                            onChange={(e) => handleOptionChange(qIdx, oIdx, 'description', e.target.value)}
                                            className={styles.input}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '3rem' }}>
                    <button type="submit" className={styles.btnPrimary} style={{ padding: '0.8rem 2rem' }} disabled={submitting}>
                        {submitting ? 'Saving Quiz Settings...' : 'Save Scent Finder Quiz'}
                    </button>
                </div>
            </form>
        </div>
    );
}
