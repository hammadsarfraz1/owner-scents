'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './MobileHeader.module.css';
import { useState } from 'react';

export default function MobileHeader() {
    const { toggleCart, cartCount } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
        }
    };

    return (
        <header className={styles.mobileHeader}>
            <div className={styles.topRow}>
                <div className={styles.logo}>
                    <Link href="/">
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
                <form onSubmit={handleSearch} className={styles.searchInputWrapper}>
                    <input
                        type="text"
                        placeholder="Search"
                        className={styles.searchInput}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <button type="submit" className={styles.searchBtn}>
                        <Search className={styles.searchIcon} size={20} />
                    </button>
                </form>
            </div>
        </header>
    );
}
