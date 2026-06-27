'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useRef, Suspense } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';
import ProductCard, { Product } from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import { X, SlidersHorizontal, ChevronLeft, ChevronRight, Filter, Users, Layers, ChevronDown } from 'lucide-react';

type CategoryItem = {
    id: string;
    name: string;
    isVisible: boolean;
};

function HorizontalFilterSlider({ 
    title, 
    items, 
    selectedItem, 
    onSelect 
}: { 
    title: string; 
    items: string[]; 
    selectedItem: string; 
    onSelect: (item: string) => void; 
}) {
    const sliderRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (sliderRef.current) {
            const scrollAmount = direction === 'left' ? -280 : 280;
            sliderRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    return (
        <div className={styles.topFilterSliderBar}>
            <div className={styles.sliderBarHeader}>
                <span className={styles.sliderBarTitle}>{title}</span>
                <div className={styles.sliderNavBtns}>
                    <button onClick={() => scroll('left')} className={styles.sliderNavBtn} aria-label={`Scroll ${title} left`}>
                        <ChevronLeft size={15} />
                    </button>
                    <button onClick={() => scroll('right')} className={styles.sliderNavBtn} aria-label={`Scroll ${title} right`}>
                        <ChevronRight size={15} />
                    </button>
                </div>
            </div>
            <div className={styles.sliderTrack} ref={sliderRef}>
                {items.map((item) => (
                    <button
                        key={item}
                        className={`${styles.sliderPillCard} ${selectedItem === item ? styles.activeSliderPillCard : ''}`}
                        onClick={() => onSelect(item)}
                    >
                        <span>{item}</span>
                        {selectedItem === item && <span className={styles.sliderActiveDot} />}
                    </button>
                ))}
            </div>
        </div>
    );
}

function CategoryHorizontalRow({ title, products, onQuickView }: { title: string, products: Product[], onQuickView: (p: Product) => void }) {
    const rowRef = useRef<HTMLDivElement>(null);

    const scroll = (direction: 'left' | 'right') => {
        if (rowRef.current) {
            const scrollAmount = direction === 'left' ? -360 : 360;
            rowRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (products.length === 0) return null;

    return (
        <div className={styles.categorySection}>
            <div className={styles.categorySectionHeader}>
                <div className={styles.titleWrapper}>
                    <h2 className={styles.categorySectionTitle}>{title}</h2>
                    <span className={styles.categoryCountBadge}>{products.length} {products.length === 1 ? 'Fragrance' : 'Fragrances'}</span>
                </div>
                <div className={styles.scrollNavBtns}>
                    <button onClick={() => scroll('left')} className={styles.scrollNavBtn} aria-label="Scroll left">
                        <ChevronLeft size={18} />
                    </button>
                    <button onClick={() => scroll('right')} className={styles.scrollNavBtn} aria-label="Scroll right">
                        <ChevronRight size={18} />
                    </button>
                </div>
            </div>
            <div className={styles.horizontalScrollRow} ref={rowRef}>
                {products.map((product) => (
                    <div key={product.id} className={styles.horizontalCardWrapper}>
                        <ProductCard product={product} onQuickView={onQuickView} />
                    </div>
                ))}
            </div>
        </div>
    );
}

function ShopContent() {
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<Product[]>([]);
    const [dbCategories, setDbCategories] = useState<CategoryItem[]>([]);
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
        Promise.all([
            fetch('/api/products?t=' + Date.now()).then(res => res.json()),
            fetch('/api/categories?t=' + Date.now()).then(res => res.json())
        ])
        .then(([productsData, categoriesData]) => {
            setProducts(Array.isArray(productsData) ? productsData : []);
            setDbCategories(Array.isArray(categoriesData) ? categoriesData : []);
            setLoading(false);
        })
        .catch((err) => {
            console.error('Error loading shop data:', err);
            setLoading(false);
        });
    }, []);

    const productCategories = Array.from(new Set(products.map(p => p.category).filter((c): c is string => Boolean(c))));
    const dbCategoryNames = dbCategories.map(c => c.name);
    const allUniqueCategories = Array.from(new Set([...dbCategoryNames, ...productCategories]));

    const categoryNames = ['All', ...allUniqueCategories];
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

    // Determine categories to display strictly as category rows
    const activeCategoriesToDisplay = selectedCategory === 'All' 
        ? allUniqueCategories
        : [selectedCategory];

    return (
        <div className={styles.main}>
            <Navbar onSearch={(term: string) => setSearchTerm(term)} />
            <div className={`container ${styles.shopContainer}`} style={{ marginTop: '2rem' }}>

                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <Filter size={16} className={styles.sidebarHeaderIcon} />
                        <h2>Refine Selection</h2>
                    </div>

                    <div className={`${styles.filterFolder} ${genderFolderOpen ? styles.folderOpen : ''}`}>
                        <button 
                            className={styles.folderHeader} 
                            onClick={() => setGenderFolderOpen(!genderFolderOpen)}
                        >
                            <div className={styles.folderHeaderLeft}>
                                <Users size={16} className={styles.folderHeaderIcon} />
                                <span>Gender</span>
                            </div>
                            <ChevronDown size={16} className={`${styles.folderChevron} ${genderFolderOpen ? styles.chevronRotated : ''}`} />
                        </button>
                        <div className={styles.folderContent}>
                            <div className={styles.filterPillsGrid}>
                                {genders.map(g => (
                                    <button
                                        key={g}
                                        className={`${styles.filterPillBtn} ${selectedGender === g ? styles.activePill : ''}`}
                                        onClick={() => setSelectedGender(g)}
                                    >
                                        <span>{g}</span>
                                        {selectedGender === g && <span className={styles.pillActiveDot} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className={`${styles.filterFolder} ${categoryFolderOpen ? styles.folderOpen : ''}`}>
                        <button 
                            className={styles.folderHeader} 
                            onClick={() => setCategoryFolderOpen(!categoryFolderOpen)}
                        >
                            <div className={styles.folderHeaderLeft}>
                                <Layers size={16} className={styles.folderHeaderIcon} />
                                <span>Category</span>
                            </div>
                            <ChevronDown size={16} className={`${styles.folderChevron} ${categoryFolderOpen ? styles.chevronRotated : ''}`} />
                        </button>
                        <div className={styles.folderContent}>
                            <div className={styles.filterPillsGrid}>
                                {categoryNames.map(c => (
                                    <button
                                        key={c}
                                        className={`${styles.filterPillBtn} ${selectedCategory === c ? styles.activePill : ''}`}
                                        onClick={() => setSelectedCategory(c)}
                                    >
                                        <span>{c}</span>
                                        {selectedCategory === c && <span className={styles.pillActiveDot} />}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    {(selectedGender !== 'All' || selectedCategory !== 'All') && (
                        <button 
                            className={styles.resetFiltersBtn}
                            onClick={() => {
                                setSelectedGender('All');
                                setSelectedCategory('All');
                            }}
                        >
                            Reset All Filters
                        </button>
                    )}
                </aside>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.catalogHeader}>
                        <h1 className={styles.title}>
                            {selectedCategory === 'All' ? 'All Fragrances' : selectedCategory}
                        </h1>
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
                                outline: 'none',
                                borderRadius: '4px'
                            }}
                        >
                            <option value="newest">Newest</option>
                            <option value="price-asc">Price: Low to High</option>
                            <option value="price-desc">Price: High to Low</option>
                        </select>
                    </div>

                    {/* Separate Interactive Sliders for Gender & Category */}
                    <div className={styles.slidersWrapper}>
                        <HorizontalFilterSlider 
                            title="Filter By Gender" 
                            items={genders} 
                            selectedItem={selectedGender} 
                            onSelect={setSelectedGender} 
                        />
                        <HorizontalFilterSlider 
                            title="Filter By Category" 
                            items={categoryNames} 
                            selectedItem={selectedCategory} 
                            onSelect={setSelectedCategory} 
                        />
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
                        /* Strict Category-Wise Presentation ONLY */
                        <div className={styles.categoryRowsContainer}>
                            {activeCategoriesToDisplay.map(catName => {
                                const catProducts = filteredProducts.filter(p => p.category === catName);
                                return (
                                    <CategoryHorizontalRow 
                                        key={catName} 
                                        title={catName} 
                                        products={catProducts} 
                                        onQuickView={setQuickViewProduct} 
                                    />
                                );
                            })}
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
                                    {categoryNames.map(c => (
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
