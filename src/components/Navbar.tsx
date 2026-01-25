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
                        <span className={styles.searchIcon}>🔍</span>
                        <input
                            type="text"
                            placeholder="Search..."
                            className={styles.searchInput}
                            onChange={(e) => onSearch && onSearch(e.target.value)}
                        />
                    </div>

                    {mounted && (
                        <>
                            <button onClick={toggleTheme} className={styles.themeToggle} aria-label="Toggle Theme">
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>

                            <button
                                onClick={toggleCart}
                                className={styles.cartBtn}
                                style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', letterSpacing: '1px', textTransform: 'uppercase' }}
                            >
                                Cart ({cartCount})
                            </button>

                            {session ? (
                                <>
                                    <Link href="/wishlist" className={styles.link}>Wishlist </Link>
                                    <Link href="/profile" className={styles.link}>My Profile</Link>
                                    <button onClick={() => signOut()} className={styles.authBtn}>Sign Out</button>
                                </>
                            ) : (
                                <Link href="/login" className={styles.link}>Sign In</Link>
                            )}
                        </>
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
