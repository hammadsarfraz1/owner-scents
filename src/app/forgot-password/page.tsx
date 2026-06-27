'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from '../auth.module.css';
import { KeyRound, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function ForgotPasswordPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, newPassword }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.error || 'Failed to reset password');
            } else {
                setSuccessMessage('Your password has been reset successfully! Redirecting to login...');
                setTimeout(() => {
                    router.push('/login');
                }, 2000);
            }
        } catch (err) {
            setError('An unexpected error occurred. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.card}>
                    <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                        <KeyRound size={36} style={{ color: 'var(--accent)', marginBottom: '0.5rem' }} />
                        <h1 className={styles.title}>Reset Password</h1>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                            Enter your registered account email and choose your new password
                        </p>
                    </div>

                    {error && (
                        <p style={{ color: '#ef4444', backgroundColor: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem' }}>
                            {error}
                        </p>
                    )}

                    {successMessage && (
                        <div style={{ color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.85rem', borderRadius: '8px', textAlign: 'center', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                            <CheckCircle2 size={18} />
                            <span>{successMessage}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className={styles.form}>
                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Account Email</label>
                            <input
                                type="email"
                                required
                                placeholder="name@example.com"
                                className={styles.input}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>New Password</label>
                            <input
                                type="password"
                                required
                                placeholder="At least 6 characters"
                                className={styles.input}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>

                        <div className={styles.inputGroup}>
                            <label className={styles.label}>Confirm New Password</label>
                            <input
                                type="password"
                                required
                                placeholder="Re-enter new password"
                                className={styles.input}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`${styles.button} sheenEffect`}
                            disabled={loading}
                        >
                            {loading ? 'Updating Password...' : 'Reset Password'}
                        </button>
                    </form>

                    <p className={styles.linkText} style={{ marginTop: '1.5rem' }}>
                        <Link href="/login" className={styles.link} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                            <ArrowLeft size={14} /> Back to Sign In
                        </Link>
                    </p>
                </div>
            </div>
            <Footer />
        </>
    );
}
