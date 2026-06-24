'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, X } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import styles from './MobileHeader.module.css';
import { useState, useEffect } from 'react';

export default function MobileHeader() {
    const { toggleCart, cartCount } = useCart();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [scrollDir, setScrollDir] = useState("up");
    const [lastScrollY, setLastScrollY] = useState(0);
    const router = useRouter();

    useEffect(() => {
        const handleScroll = () => {
            const currentScrollY = window.pageYOffset;
            if (currentScrollY <= 60) {
                setScrollDir("up");
                return;
            }
            if (currentScrollY > lastScrollY) {
                setScrollDir("down");
            } else {
                setScrollDir("up");
            }
            setLastScrollY(currentScrollY);
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [lastScrollY]);

    useEffect(() => {
        if (isSearchOpen) {
            fetch('/api/products')
                .then(res => res.json())
                .then(data => setAllProducts(data))
                .catch(console.error);
        }
    }, [isSearchOpen]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/shop?search=${encodeURIComponent(searchTerm)}`);
            setIsSearchOpen(false);
        }
    };

    const trendingTags = ['Midnight OUD', 'Rose', 'Velvet', 'Woody', 'Floral'];

    const matchedProducts = searchTerm.trim() === '' ? [] : allProducts.filter(p => 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
        (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
    ).slice(0, 5);

    return (
        <>
            <header className={`${styles.mobileHeader} ${scrollDir === 'down' ? styles.mobileHeaderHidden : ''}`}>
                <div className={styles.topRow}>
                    <div className={styles.logo}>
                        <Link href="/">
                            <span className={styles.logoText}>OWNER SCENTS</span>
                        </Link>
                    </div>

                    <div className={styles.actions}>
                        <button onClick={() => setIsSearchOpen(true)} className={styles.iconBtn} aria-label="Open Search">
                            <Search size={20} strokeWidth={1.5} />
                        </button>
                        <button onClick={toggleCart} className={styles.iconBtn} aria-label="Open Cart">
                            <ShoppingBag size={20} strokeWidth={1.5} />
                            {cartCount > 0 && <span className={styles.badge}>{cartCount}</span>}
                        </button>
                    </div>
                </div>
            </header>

            {isSearchOpen && (
                <div className={styles.searchOverlay}>
                    <div className={styles.overlayHeader}>
                        <h2 className={styles.overlayTitle}>Search Owner Scents</h2>
                        <button onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }} className={styles.closeOverlayBtn}>
                            <X size={24} />
                        </button>
                    </div>

                    <div className={styles.overlayContent}>
                        <form onSubmit={handleSearch} className={styles.overlayInputWrapper}>
                            <input
                                type="text"
                                placeholder="Search fragrances, notes, collections..."
                                className={styles.overlayInput}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                autoFocus
                            />
                            <button type="submit" className={styles.overlaySearchBtn}>
                                <Search size={22} />
                            </button>
                        </form>

                        <div className={styles.trendingSection}>
                            <h3>Trending Searches</h3>
                            <div className={styles.tagsContainer}>
                                {trendingTags.map(tag => (
                                    <button 
                                        key={tag} 
                                        type="button" 
                                        className={styles.trendTag}
                                        onClick={() => setSearchTerm(tag)}
                                    >
                                        ✦ {tag.toUpperCase()}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {searchTerm.trim() !== '' && (
                            <div className={styles.resultsSection}>
                                <h3>Suggested Products ({matchedProducts.length})</h3>
                                {matchedProducts.length === 0 ? (
                                    <p className={styles.noResults}>No matches found for "{searchTerm}"</p>
                                ) : (
                                    <div className={styles.searchResultsList}>
                                        {matchedProducts.map(product => (
                                            <Link 
                                                key={product.id} 
                                                href={`/shop/${product.id}`}
                                                className={styles.resultItem}
                                                onClick={() => { setIsSearchOpen(false); setSearchTerm(''); }}
                                            >
                                                <div className={styles.resultImgWrapper}>
                                                    {product.image ? (
                                                        <img src={product.image} alt={product.name} className={styles.resultImg} />
                                                    ) : (
                                                        <span className={styles.resultFallback}>{product.name[0]}</span>
                                                    )}
                                                </div>
                                                <div className={styles.resultInfo}>
                                                    <span className={styles.resultName}>{product.name}</span>
                                                    <span className={styles.resultCategory}>
                                                        {product.gender} • {product.category || 'Eau De Parfum'}
                                                    </span>
                                                </div>
                                                <span className={styles.resultPrice}>${Number(product.price).toFixed(2)}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
