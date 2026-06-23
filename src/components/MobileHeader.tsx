'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './MobileHeader.module.css';
import { useState } from 'react';

export default function MobileHeader() {
    const { toggleCart, cartCount } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
            setIsSearchOpen(false);
        }
    };

    return (
        <header className={styles.mobileHeader}>
            <div className={styles.topRow}>
                <div className={styles.logo}>
                    <Link href="/">
                        <span className={styles.logoText}>OWNER SCENTS</span>
                    </Link>
                </div>

                <div className={styles.actions}>
                    <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={styles.iconBtn} aria-label="Toggle Search">
                        {isSearchOpen ? <X size={20} strokeWidth={1.5} /> : <Search size={20} strokeWidth={1.5} />}
                    </button>
                    <button onClick={toggleCart} className={styles.iconBtn} aria-label="Open Cart">
                        <ShoppingBag size={20} strokeWidth={1.5} />
                        {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                    </button>
                </div>
            </div>

            {isSearchOpen && (
                <div className={styles.searchRow}>
                    <form onSubmit={handleSearch} className={styles.searchInputWrapper}>
                        <input
                            type="text"
                            placeholder="SEARCH SCENTS..."
                            className={styles.searchInput}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            autoFocus
                        />
                        <button type="submit" className={styles.searchBtn}>
                            <Search size={18} />
                        </button>
                    </form>
                </div>
            )}
        </header>
    );
}
