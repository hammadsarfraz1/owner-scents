'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';
import ProductCard, { Product } from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { X, SlidersHorizontal } from 'lucide-react';

// Local Product type removed in favor of imported one to ensure compatibility
// type Product = { ... }

function ShopContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const { addToCart } = useCart();
    const [loading, setLoading] = useState(true);
    const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedGender, setSelectedGender] = useState<string>('All');
    const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [sortOption, setSortOption] = useState<string>('newest');
    const [genderFolderOpen, setGenderFolderOpen] = useState(true);
    const [categoryFolderOpen, setCategoryFolderOpen] = useState(true);
    const [isBottomSheetOpen, setIsBottomSheetOpen] = useState(false);

    useEffect(() => {
        if (isBottomSheetOpen) {
            document.body.style.overflow = 'hidden';
            
            const preventScroll = (e: Event) => {
                const sheet = document.querySelector(`.${styles.bottomSheet}`);
                if (sheet && !sheet.contains(e.target as Node)) {
                    e.preventDefault();
                }
            };
            
            window.addEventListener('wheel', preventScroll, { passive: false });
            window.addEventListener('touchmove', preventScroll, { passive: false });
            
            return () => {
                document.body.style.overflow = '';
                window.removeEventListener('wheel', preventScroll);
                window.removeEventListener('touchmove', preventScroll);
            };
        }
    }, [isBottomSheetOpen]);

    useEffect(() => {
        const genderParam = searchParams.get('gender');
        const categoryParam = searchParams.get('category');
        if (genderParam) setSelectedGender(genderParam);
        if (categoryParam) setSelectedCategory(categoryParam);
    }, [searchParams]);

    useEffect(() => {
        fetch('/api/products?t=' + Date.now())
            .then((res) => res.json())
            .then((data) => {
                setProducts(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category).filter((c): c is string => !!c)))];
    const genders = ['All', 'Men', 'Women', 'Unisex'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGender = selectedGender === 'All' || 
            product.gender === selectedGender || 
            ((selectedGender === 'Men' || selectedGender === 'Women') && product.gender === 'Unisex');
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesGender && matchesCategory;
    }).sort((a: Product, b: Product) => {
        if (sortOption === 'price-asc') return Number(a.price) - Number(b.price);
        if (sortOption === 'price-desc') return Number(b.price) - Number(a.price);
        return 0;
    });

    return (
        <div className={styles.main}>
            <Navbar onSearch={(term: string) => setSearchTerm(term)} />
            <div className={`container ${styles.shopContainer}`} style={{ marginTop: '2rem' }}>
                {/* Mobile Filter Chips removed in favor of sticky bottom sheet trigger */}

                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={`${styles.filterFolder} ${genderFolderOpen ? styles.folderOpen : ''}`}>
                        <button 
                            className={styles.folderHeader} 
                            onClick={() => setGenderFolderOpen(!genderFolderOpen)}
                        >
                            <span>Gender</span>
                            <span className={styles.folderArrow}>{genderFolderOpen ? '−' : '+'}</span>
                        </button>
                        <div className={styles.folderContent}>
                            {genders.map(g => (
                                <label key={g} className={styles.filterLabel}>
                                    <input
                                        type="radio"
                                        name="gender"
                                        checked={selectedGender === g}
                                        onChange={() => setSelectedGender(g)}
                                    />
                                    {g}
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className={`${styles.filterFolder} ${categoryFolderOpen ? styles.folderOpen : ''}`}>
                        <button 
                            className={styles.folderHeader} 
                            onClick={() => setCategoryFolderOpen(!categoryFolderOpen)}
                        >
                            <span>Category</span>
                            <span className={styles.folderArrow}>{categoryFolderOpen ? '−' : '+'}</span>
                        </button>
                        <div className={styles.folderContent}>
                            {categories.map(c => (
                                <label key={c} className={styles.filterLabel}>
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === c}
                                        onChange={() => setSelectedCategory(c)}
                                    />
                                    {c}
                                </label>
                            ))}
                        </div>
                    </div>
                </aside>

                <div style={{ flex: 1 }}>
                    <div className={styles.catalogHeader}>
                        <h1 className={styles.title}>All Fragrances</h1>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            style={{
                                padding: '0 1rem',
                                minHeight: '44px',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                color: 'var(--text-primary)',
                                fontFamily: 'inherit',
                                fontSize: '0.85rem',
                                cursor: 'pointer',
                                outline: 'none'
                            }}
                        >
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>

                    {loading ? (
                        <div className={styles.grid}>
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className={styles.skeletonCard}>
                                    <div className={`${styles.skeletonImage} skeleton`} />
                                    <div className={`${styles.skeletonTitle} skeleton`} />
                                    <div className={`${styles.skeletonText} skeleton`} />
                                    <div className={`${styles.skeletonPrice} skeleton`} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles.grid}>
                            {filteredProducts.map((product, index) => (
                                <div 
                                    key={product.id} 
                                    className="animateFadeInUp"
                                    style={{ animationDelay: `${(index % 6) * 120}ms` }}
                                >
                                    <ProductCard
                                        product={product}
                                        onQuickView={setQuickViewProduct}
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Sticky Filters & Sort Button for Mobile */}
            <button 
                className={styles.mobileFilterStickyBtn} 
                onClick={() => setIsBottomSheetOpen(true)}
            >
                <SlidersHorizontal size={16} />
                <span>Filters & Sort</span>
                {(selectedGender !== 'All' || selectedCategory !== 'All' || sortOption !== 'newest') && (
                    <span className={styles.activeFilterCount}></span>
                )}
            </button>

            {/* Bottom Sheet Filter Menu */}
            {isBottomSheetOpen && (
                <div className={styles.bottomSheetBackdrop} onClick={() => setIsBottomSheetOpen(false)}>
                    <div className={styles.bottomSheet} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.bottomSheetHeader}>
                            <div className={styles.bottomSheetDragHandle} />
                            <h2>Filters & Sort</h2>
                            <button className={styles.closeBtn} onClick={() => setIsBottomSheetOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className={styles.bottomSheetContent}>
                            {/* Sort Options */}
                            <div className={styles.sheetSection}>
                                <h3>Sort By</h3>
                                <div className={styles.sheetOptionsGrid}>
                                    {[
                                        { val: 'newest', label: 'Newest' },
                                        { val: 'price-asc', label: 'Price: Low to High' },
                                        { val: 'price-desc', label: 'Price: High to Low' }
                                    ].map(opt => (
                                        <button
                                            key={opt.val}
                                            className={`${styles.sheetOptionBtn} ${sortOption === opt.val ? styles.activeOption : ''}`}
                                            onClick={() => setSortOption(opt.val)}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Gender Options */}
                            <div className={styles.sheetSection}>
                                <h3>Gender</h3>
                                <div className={styles.sheetOptionsGrid}>
                                    {genders.map(g => (
                                        <button
                                            key={g}
                                            className={`${styles.sheetOptionBtn} ${selectedGender === g ? styles.activeOption : ''}`}
                                            onClick={() => setSelectedGender(g)}
                                        >
                                            {g}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Category Options */}
                            <div className={styles.sheetSection}>
                                <h3>Category</h3>
                                <div className={styles.sheetOptionsGrid}>
                                    {categories.map(c => (
                                        <button
                                            key={c}
                                            className={`${styles.sheetOptionBtn} ${selectedCategory === c ? styles.activeOption : ''}`}
                                            onClick={() => setSelectedCategory(c)}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.bottomSheetFooter}>
                            <button className={styles.resetBtn} onClick={() => {
                                setSelectedGender('All');
                                setSelectedCategory('All');
                                setSortOption('newest');
                            }}>
                                Reset All
                            </button>
                            <button className={styles.applyBtn} onClick={() => setIsBottomSheetOpen(false)}>
                                Apply
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <QuickViewModal
                product={quickViewProduct}
                onClose={() => setQuickViewProduct(null)}
            />
            <Footer />
        </div>
    );
}

export default function Shop() {
    return (
        <Suspense fallback={<div>Loading Shop...</div>}>
            <ShopContent />
        </Suspense>
    );
}
