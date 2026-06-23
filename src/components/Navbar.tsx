'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import styles from './Navbar.module.css';
import { useCart } from '@/context/CartContext';
import { useTheme } from '@/context/ThemeContext';
import { useSession, signOut } from "next-auth/react";

export default function Navbar({ onSearch }: { onSearch?: (term: string) => void }) {
    const [isOpen, setIsOpen] = useState(false);
    const { cartCount, toggleCart } = useCart();
    const { data: session } = useSession();
    const { theme, toggleTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <nav className={styles.navbar}>
            <div className={styles.container}>
                <div className={styles.logo}>
                    <Link href="/">OWNER SCENTS</Link>
                </div>

                <div className={`${styles.navRight} ${isOpen ? styles.active : ''}`}>
                    <Link href="/" className={styles.link}>Home</Link>
                    <Link href="/shop" className={styles.link}>Shop</Link>
                    <Link href="/about" className={styles.link}>About</Link>

                    <div className={styles.searchWrapper}>
                        <span className={styles.searchIcon}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
                        </span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles.searchInput}
                            onChange={(e) => onSearch && onSearch(e.target.value)}
                        />
                    </div>

                    {mounted && (
                        <div className={styles.actionGroup}>
                            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
                                {theme === 'light' ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
                                ) : (
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
                                )}
                            </button>

                            <button
                                onClick={toggleCart}
                                className={styles.cartBtn}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
                                <span className={styles.cartLabel}>Cart</span>
                                <span className={styles.cartBadge}>{cartCount}</span>
                            </button>

                            {session ? (
                                <>
                                    <Link href="/wishlist" className={styles.link}>Wishlist</Link>
                                    <Link href="/profile" className={styles.link}>Profile</Link>
                                    <button onClick={() => signOut()} className={styles.authBtn}>Sign Out</button>
                                </>
                            ) : (
                                <Link href="/login" className={styles.authBtn}>Sign In</Link>
                            )}
                        </div>
                    )}
                </div>

                <div className={styles.hamburger} onClick={() => setIsOpen(!isOpen)}>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                    <span className={styles.bar}></span>
                </div>
            </div>
        </nav>
    );
}
