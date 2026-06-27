'use client';

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';
import { 
    LayoutDashboard, 
    ShoppingBag, 
    BarChart3,
    Package, 
    FolderTree, 
    Sparkles, 
    Star, 
    Home, 
    Search, 
    ExternalLink, 
    ShieldCheck, 
    User,
    LogOut
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        if (status === 'loading') return;

        if (status === 'unauthenticated') {
            router.push('/login?callbackUrl=/owner-portal-5412');
            return;
        }

        const userRole = (session?.user as any)?.role;
        if (userRole === 'ADMIN') {
            setIsAuthorized(true);
        }
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#f4f4f5', gap: '1rem' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '50%', border: '3px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                <span style={{ letterSpacing: '2px', textTransform: 'uppercase', fontSize: '0.85rem', color: '#a1a1aa' }}>Authenticating Executive Portal...</span>
                <style jsx>{`
                    @keyframes spin {
                        0% { transform: rotate(0deg); }
                        100% { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    const userRole = (session?.user as any)?.role;
    if (status === 'authenticated' && userRole !== 'ADMIN') {
        return (
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#09090b', color: '#f4f4f5', padding: '2rem', textAlign: 'center' }}>
                <ShieldCheck size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
                <h2 style={{ fontSize: '1.8rem', marginBottom: '0.5rem', color: '#ef4444', fontFamily: 'var(--font-serif)' }}>Executive Privileges Required</h2>
                <p style={{ color: '#a1a1aa', marginBottom: '1.5rem', maxWidth: '420px', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    Authenticated as <strong>{session?.user?.email}</strong>. Admin authorization is strictly restricted to verified owner accounts.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                    <Link href="/login?callbackUrl=/owner-portal-5412" className={styles.btnPrimary}>
                        Sign in as Admin
                    </Link>
                    <Link href="/" className={styles.btnSecondary}>
                        Back to Storefront
                    </Link>
                </div>
            </div>
        );
    }

    const navSections = [
        {
            title: 'OVERVIEW',
            items: [
                { name: 'Dashboard', path: '/owner-portal-5412', icon: LayoutDashboard },
                { name: 'All Orders', path: '/owner-portal-5412/orders', icon: ShoppingBag },
                { name: 'Analytics', path: '/owner-portal-5412/analytics', icon: BarChart3 },
            ]
        },
        {
            title: 'CATALOG MANAGEMENT',
            items: [
                { name: 'Products', path: '/owner-portal-5412/products', icon: Package },
                { name: 'Categories', path: '/owner-portal-5412/categories', icon: FolderTree },
                { name: 'Scent Notes', path: '/owner-portal-5412/scent-notes', icon: Sparkles },
            ]
        },
        {
            title: 'STOREFRONT CUSTOMIZATION',
            items: [
                { name: 'Customer Reviews', path: '/owner-portal-5412/reviews', icon: Star },
                { name: 'Edit Homepage', path: '/owner-portal-5412/homepage', icon: Home },
                { name: 'Scent Finder Quiz', path: '/owner-portal-5412/scent-finder', icon: Search },
            ]
        }
    ];

    const currentPageName = navSections.flatMap(s => s.items).find(i => i.path === pathname)?.name || 'Executive Portal';

    return (
        <div className={styles.container}>
            {/* Sidebar */}
            <aside className={styles.sidebar}>
                <div className={styles.brand}>
                    <ShieldCheck size={22} style={{ color: 'var(--accent)' }} />
                    <span>OWNER ADMIN</span>
                </div>

                <nav className={styles.nav}>
                    {navSections.map((section, idx) => (
                        <div key={idx} style={{ marginBottom: '1.25rem' }}>
                            <div className={styles.sectionHeaderLabel}>{section.title}</div>
                            {section.items.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.path;
                                return (
                                    <Link
                                        key={item.path}
                                        href={item.path}
                                        className={`${styles.navLink} ${isActive ? styles.active : ''}`}
                                    >
                                        <Icon size={18} className={styles.navIcon} />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className={styles.user}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textAlign: 'left' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent)', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '0.9rem', flexShrink: 0 }}>
                            {session?.user?.name?.charAt(0).toUpperCase() || 'A'}
                        </div>
                        <div style={{ overflow: 'hidden' }}>
                            <div style={{ fontWeight: 600, color: '#fff', fontSize: '0.85rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                {session?.user?.name || 'Administrator'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--accent)', letterSpacing: '0.5px' }}>
                                Master Owner
                            </div>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content Area with Top Header */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
                <header className={styles.topHeader}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <h2 className={styles.pageTitleHeading}>{currentPageName}</h2>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                        <Link href="/" target="_blank" className={styles.storefrontBtn}>
                            <span>View Live Website</span>
                            <ExternalLink size={14} />
                        </Link>
                    </div>
                </header>

                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    );
}
