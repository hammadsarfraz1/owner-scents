'use client';

import Link from 'next/link';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './MobileHeader.module.css';

export default function MobileHeader() {
    const { toggleCart, cartCount } = useCart();

    return (
        <header className={styles.mobileHeader}>
            <div className={styles.topRow}>
                <div className={styles.logo}>
                    <Link href="/">
                        {/* Use Image or Text based on preference, text for now but styled like logo */}
                        <span className={styles.logoText}>Owner Scents</span>
                    </Link>
                </div>

                <div className={styles.actions}>
                    <button onClick={toggleCart} className={styles.iconBtn}>
                        <ShoppingBag size={24} strokeWidth={1.5} />
                        {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                    </button>
                    <button className={styles.iconBtn}>
                        <Menu size={24} strokeWidth={1.5} />
                    </button>
                </div>
            </div>

            <div className={styles.searchRow}>
                <div className={styles.searchInputWrapper}>
                    <input type="text" placeholder="Search" className={styles.searchInput} />
                    <Search className={styles.searchIcon} size={20} />
                </div>
            </div>
        </header>
    );
}
