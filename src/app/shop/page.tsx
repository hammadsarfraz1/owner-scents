'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';
import QuickViewModal from '@/components/QuickViewModal';
import ProductCard from '@/components/ProductCard';

type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
    gender: string;
    category: string;
};

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

    useEffect(() => {
        const genderParam = searchParams.get('gender');
        const categoryParam = searchParams.get('category');
        if (genderParam) setSelectedGender(genderParam);
        if (categoryParam) setSelectedCategory(categoryParam);
    }, [searchParams]);

    useEffect(() => {
        fetch('/api/products')
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

    const categories = ['All', ...Array.from(new Set(products.map(p => p.category)))];
    const genders = ['All', 'Men', 'Women', 'Unisex'];

    const filteredProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGender = selectedGender === 'All' || product.gender === selectedGender;
        const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
        return matchesSearch && matchesGender && matchesCategory;
    }).sort((a, b) => {
        if (sortOption === 'price-asc') return Number(a.price) - Number(b.price);
        if (sortOption === 'price-desc') return Number(b.price) - Number(a.price);
        return 0;
    });

    return (
        <div className={styles.main}>
            <Navbar onSearch={(term: string) => setSearchTerm(term)} />
            <div className={`container ${styles.shopContainer}`} style={{ marginTop: '2rem', display: 'flex', gap: '2rem' }}>
                {/* Mobile Filter Chips */}
                <div className={styles.mobileFilters} style={{ display: 'none' /* Will be overridden by CSS media query */ }}>
                    {genders.map(g => (
                        <button
                            key={g}
                            className={`${styles.filterChip} ${selectedGender === g ? styles.active : ''}`}
                            onClick={() => setSelectedGender(g)}
                        >
                            {g}
                        </button>
                    ))}
                    {categories.filter(c => c !== 'All').map(c => (
                        <button
                            key={c}
                            className={`${styles.filterChip} ${selectedCategory === c ? styles.active : ''}`}
                            onClick={() => setSelectedCategory(c)}
                        >
                            {c}
                        </button>
                    ))}
                </div>

                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.filterGroup}>
                        <h3>Gender</h3>
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
                    <div className={styles.filterGroup}>
                        <h3>Category</h3>
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
                </aside>

                <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h1 className={styles.title} style={{ marginBottom: 0 }}>All Fragrances</h1>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            style={{
                                padding: '0.5rem 1rem',
                                background: 'transparent',
                                border: '1px solid #333',
                                color: 'inherit',
                                fontFamily: 'inherit',
                                cursor: 'pointer'
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
