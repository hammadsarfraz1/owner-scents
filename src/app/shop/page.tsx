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
        const matchesGender = selectedGender === 'All' || product.gender === selectedGender;
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
                {/* Mobile Filter Chips */}
                <div className={styles.mobileFilters}>
                    <div className={styles.mobileFilterGroup}>
                        <span className={styles.mobileFilterLabel}>Gender</span>
                        <div className={styles.mobileFilterScroll}>
                            {genders.map(g => (
                                <button
                                    key={g}
                                    className={`${styles.filterChip} ${selectedGender === g ? styles.active : ''}`}
                                    onClick={() => setSelectedGender(g)}
                                >
                                    {g}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className={styles.mobileFilterGroup}>
                        <span className={styles.mobileFilterLabel}>Category</span>
                        <div className={styles.mobileFilterScroll}>
                            {categories.map(c => (
                                <button
                                    key={c}
                                    className={`${styles.filterChip} ${selectedCategory === c ? styles.active : ''}`}
                                    onClick={() => setSelectedCategory(c)}
                                >
                                    {c}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

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
                        <p style={{ textAlign: 'center' }}>Loading scents...</p>
                    ) : (
                        <div className={styles.grid}>
                            {filteredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                    onQuickView={setQuickViewProduct}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
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
