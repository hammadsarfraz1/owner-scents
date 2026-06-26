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
            router.push('/login');
            return;
        }

        const userRole = (session?.user as any)?.role;
        // Basic check: in a real app, ensure 'role' is passed correctly in session
        if (userRole !== 'ADMIN') {
            // If they are logged in but not admin, redirect home
            router.push('/');
        } else {
            setIsAuthorized(true);
        }
    }, [session, status, router]);

    if (status === 'loading' || !isAuthorized) {
        return <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Checking Access...</div>;
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
