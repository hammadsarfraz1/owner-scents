'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingBag, Heart, User, ShoppingCart } from 'lucide-react';
import styles from './MobileBottomNav.module.css';
import { useCart } from '@/context/CartContext';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';

export default function MobileBottomNav() {
    const pathname = usePathname();
    const { cartCount, toggleCart } = useCart();
    const { data: session } = useSession();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const isActive = (path: string) => pathname === path;

    if (!mounted) return null;

    return (
        <nav className={styles.bottomNav}>
            <Link href="/" className={`${styles.navItem} ${isActive('/') ? styles.active : ''}`}>
                <Home size={22} strokeWidth={isActive('/') ? 2.5 : 1.5} />
                <span className={styles.label}>Home</span>
            </Link>

            <Link href="/shop" className={`${styles.navItem} ${isActive('/shop') ? styles.active : ''}`}>
                <ShoppingBag size={22} strokeWidth={isActive('/shop') ? 2.5 : 1.5} />
                <span className={styles.label}>Shop</span>
            </Link>

            <button onClick={toggleCart} className={`${styles.navItem} ${styles.cartBtn}`}>
                <div className={styles.iconWrapper}>
                    <ShoppingCart size={22} strokeWidth={1.5} />
                    {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                </div>
                <span className={styles.label}>Cart</span>
            </button>

            <Link href="/wishlist" className={`${styles.navItem} ${isActive('/wishlist') ? styles.active : ''}`}>
                <Heart size={22} strokeWidth={isActive('/wishlist') ? 2.5 : 1.5} />
                <span className={styles.label}>Wishlist</span>
            </Link>

            <Link
                href={session ? "/profile" : "/login"}
                className={`${styles.navItem} ${isActive('/profile') || isActive('/login') ? styles.active : ''}`}
            >
                <User size={22} strokeWidth={(isActive('/profile') || isActive('/login')) ? 2.5 : 1.5} />
                <span className={styles.label}>{session ? 'Profile' : 'Login'}</span>
            </Link>
        </nav>
    );
}
