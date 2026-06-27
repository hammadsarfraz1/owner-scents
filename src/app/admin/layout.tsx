'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/admin');
            return;
        }

        const userRole = (session?.user as any)?.role;
        if (userRole === 'ADMIN') {
            setIsAuthorized(true);
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>
                Checking Admin Access...
            </div>
        );
    }

    const userRole = (session?.user as any)?.role;
    if (status === 'authenticated' && userRole !== 'ADMIN') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'var(--text-primary)', padding: '2rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#ef4444' }}>Admin Access Required</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', maxWidth: '400px' }}>
                    You are logged in as <strong>{session?.user?.email}</strong>, which does not have Admin permissions.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link href="/login?callbackUrl=/admin" style={{ padding: '0.75rem 1.5rem', background: 'var(--accent)', color: '#fff', borderRadius: '6px', textDecoration: 'none', fontWeight: 600 }}>
                        Sign in as Admin
                    </Link>
                    <Link href="/" style={{ padding: '0.75rem 1.5rem', border: '1px solid var(--border-color)', color: 'var(--text-primary)', borderRadius: '6px', textDecoration: 'none' }}>
                        Back to Home
                    </Link>
                </div>
            </div>
        );
    }

    const navItems = [
        { name: 'Dashboard', path: '/admin', icon: '📊' },
        { name: 'All Orders', path: '/admin/orders', icon: '📦' },
        { name: 'Products', path: '/admin/products', icon: '✨' },
        { name: 'Categories', path: '/admin/categories', icon: '📁' },
        { name: 'Scent Notes', path: '/admin/scent-notes', icon: '🌿' },
        { name: 'Reviews', path: '/admin/reviews', icon: '⭐' },
        { name: 'Edit Homepage', path: '/admin/homepage', icon: '🏠' },
    ];

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <div className={styles.brand}>OWNER ADMIN</div>

                <nav className={styles.nav}>
                    {navItems.map((item) => (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
                        >
                            <span>{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    ))}
                </nav>

                <div className={styles.user}>
                    Logged in as: <br />
                    <strong>{session?.user?.name}</strong>
                </div>
            </aside>

            <main className={styles.content}>
                {children}
            </main>
        </div>
    );
}
