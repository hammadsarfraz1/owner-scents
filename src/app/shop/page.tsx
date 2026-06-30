'use client';

import { useSearchParams, useRouter } from 'next/navigation';
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
    gender: string;
};

function ProductHorizontalRow({ title, products, onQuickView }: { title: string, products: Product[], onQuickView: (p: Product) => void }) {
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
                <h2 className={styles.categorySectionTitle}>{title}</h2>
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
    const [isFooterVisible, setIsFooterVisible] = useState(false);
    const router = useRouter();

    const handleGenderSelect = (g: string) => {
        const params = new URLSearchParams(window.location.search);
        if (g === 'All') {
            params.delete('gender');
        } else {
            params.set('gender', g);
        }
        // Validate currently selected category with new gender 'g'
        if (g !== 'All' && selectedCategory !== 'All') {
            const currentCat = dbCategories.find(c => c.name === selectedCategory);
            if (currentCat) {
                const isValidForMen = g === 'Men' && (currentCat.gender === 'Men' || currentCat.gender === 'Unisex');
                const isValidForWomen = g === 'Women' && (currentCat.gender === 'Women' || currentCat.gender === 'Unisex');
                const isValidForUnisex = g === 'Unisex' && currentCat.gender === 'Unisex';
                if (!isValidForMen && !isValidForWomen && !isValidForUnisex) {
                    params.delete('category');
                    setSelectedCategory('All');
                }
            }
        }
        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const handleCategorySelect = (c: string) => {
        const params = new URLSearchParams(window.location.search);
        if (c === 'All') {
            params.delete('category');
        } else {
            params.set('category', c);
        }
        router.push(`/shop?${params.toString()}`, { scroll: false });
    };

    const handleResetAll = () => {
        const params = new URLSearchParams(window.location.search);
        params.delete('gender');
        params.delete('category');
        router.push(`/shop?${params.toString()}`, { scroll: false });
        setSelectedGender('All');
        setSelectedCategory('All');
    };

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
        const genderParam = searchParams.get('gender') || 'All';
        let categoryParam = searchParams.get('category') || 'All';
        if (genderParam !== 'All' && categoryParam !== 'All' && dbCategories.length > 0) {
            const currentCat = dbCategories.find(c => c.name === categoryParam);
            if (currentCat) {
                const isValidForMen = genderParam === 'Men' && (currentCat.gender === 'Men' || currentCat.gender === 'Unisex');
                const isValidForWomen = genderParam === 'Women' && (currentCat.gender === 'Women' || currentCat.gender === 'Unisex');
                const isValidForUnisex = genderParam === 'Unisex' && currentCat.gender === 'Unisex';
                if (!isValidForMen && !isValidForWomen && !isValidForUnisex) {
                    categoryParam = 'All';
                }
            }
        }
        setSelectedGender(genderParam);
        setSelectedCategory(categoryParam);
    }, [searchParams, dbCategories]);

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

    useEffect(() => {
        const footer = document.querySelector('footer');
        if (!footer) return;

        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            setIsFooterVisible(entry.isIntersecting);
        }, {
            root: null,
            rootMargin: '0px',
            threshold: 0.05
        });

        observer.observe(footer);

        return () => {
            observer.unobserve(footer);
        };
    }, []);

    const productCategories = Array.from(new Set(products.map(p => p.category).filter((c): c is string => Boolean(c))));
    
    // Filter categories dynamically based on selectedGender
    const filteredDbCategories = dbCategories.filter(c => {
        if (selectedGender === 'Men') {
            return c.gender === 'Men' || c.gender === 'Unisex';
        }
        if (selectedGender === 'Women') {
            return c.gender === 'Women' || c.gender === 'Unisex';
        }
        if (selectedGender === 'Unisex') {
            return c.gender === 'Unisex';
        }
        return true; // if selectedGender is 'All'
    });

    const filteredDbCategoryNames = filteredDbCategories.map(c => c.name);

    // Include product categories not in DB only when Gender filter is 'All'
    const extraCategories = productCategories.filter(catName => {
        const inDb = dbCategories.some(c => c.name === catName);
        if (inDb) return false;
        return selectedGender === 'All';
    });

    const allUniqueCategories = Array.from(new Set([...filteredDbCategoryNames, ...extraCategories]));

    const categoryNames = ['All', ...allUniqueCategories];
    const genders = ['All', 'Men', 'Women', 'Unisex'];

    const sortParam = searchParams.get('sort');
    const categoryParam = searchParams.get('category');
    const isFilteredView = sortParam === 'latest' || sortParam === 'popular' || categoryParam === 'curated-pick';

    let headline = 'All Fragrances';
    let subtext = '';

    if (sortParam === 'latest') {
        headline = 'NEW ARRIVALS';
        subtext = 'The latest additions to the Owner Scents collection.';
    } else if (sortParam === 'popular') {
        headline = 'BEST SELLERS';
        subtext = "The fragrances our customers can't stop choosing.";
    } else if (categoryParam === 'curated-pick') {
        headline = 'CURATED PICK';
        subtext = 'Hand-selected fragrances that define distinction.';
    } else {
        headline = selectedCategory === 'All' 
            ? (selectedGender === 'All' ? 'All Fragrances' : `${selectedGender}'s Collection`) 
            : selectedCategory;
    }

    const displayProducts = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesGender = selectedGender === 'All' || 
            product.gender === selectedGender || 
            ((selectedGender === 'Men' || selectedGender === 'Women') && product.gender === 'Unisex');

        // Apply Curated Pick check:
        if (categoryParam === 'curated-pick') {
            const hasCuratedBadge = 
                product.topNotes?.toLowerCase().includes('curated pick') || 
                product.heartNotes?.toLowerCase().includes('curated pick') || 
                product.baseNotes?.toLowerCase().includes('curated pick') ||
                product.isCuratedPick === true ||
                product.category?.toLowerCase() === 'curated-pick' ||
                product.category?.toLowerCase() === 'curated pick';
            if (!hasCuratedBadge) return false;
        }

        // Apply selectedCategory from sidebar:
        const matchesCategory = selectedCategory === 'All' || 
            selectedCategory === 'curated-pick' || 
            product.category === selectedCategory;

        return matchesSearch && matchesGender && matchesCategory;
    });

    // Custom sorting:
    displayProducts.sort((a: Product, b: Product) => {
        if (sortOption === 'price-asc') return Number(a.price) - Number(b.price);
        if (sortOption === 'price-desc') return Number(b.price) - Number(a.price);

        // Fallback default sorting for views:
        if (sortParam === 'latest') {
            return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortParam === 'popular') {
            return b.name.length - a.name.length;
        }

        // Standard: newest first
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    });

    // Determine Genders and Categories to display as horizontal product rows
    const activeGendersToDisplay = selectedGender === 'All'
        ? ['Men', 'Women', 'Unisex']
        : [selectedGender];

    const activeCategoriesToDisplay = selectedCategory === 'All' 
        ? allUniqueCategories
        : [selectedCategory];

    return (
        <div className={styles.main}>
            <div className={`container ${styles.shopContainer}`} style={{ marginTop: '2rem' }}>

                {/* Sidebar Filters */}
                <aside className={styles.sidebar}>
                    <div className={styles.sidebarHeader}>
                        <Filter size={16} className={styles.sidebarHeaderIcon} />
                        <h2>Refine Selection</h2>
                    </div>

                    <div className={styles.sidebarScrollContent}>
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
                                            onClick={() => handleGenderSelect(g)}
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
                                            onClick={() => handleCategorySelect(c)}
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
                                onClick={handleResetAll}
                            >
                                Reset All Filters
                            </button>
                        )}
                    </div>
                </aside>

                <div style={{ flex: 1, minWidth: 0 }}>
                    <div className={styles.catalogHeader}>
                        <div className={styles.catalogHeaderTop}>
                            <h1 className={styles.title}>
                                {headline}
                            </h1>
                            <select
                                value={sortOption}
                                onChange={(e) => setSortOption(e.target.value)}
                                className={styles.sortSelect}
                            >
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                        {subtext && (
                            <p className={styles.subtext}>
                                {subtext}
                            </p>
                        )}
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
                    ) : isFilteredView ? (
                        <div className={styles.grid}>
                            {displayProducts.map((product) => (
                                <ProductCard 
                                    key={product.id} 
                                    product={product} 
                                    onQuickView={setQuickViewProduct} 
                                />
                            ))}
                        </div>
                    ) : (
                        <div className={styles.categoryRowsContainer}>
                            {/* CATEGORY HORIZONTAL PRODUCT SLIDERS / CAROUSELS */}
                            {activeCategoriesToDisplay.map(catName => {
                                const catProducts = displayProducts.filter(p => p.category === catName);
                                if (catProducts.length === 0) return null;
                                return (
                                    <ProductHorizontalRow 
                                        key={`cat-${catName}`} 
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
                className={`${styles.mobileFilterStickyBtn} ${isFooterVisible ? styles.mobileFilterStickyBtnHidden : ''}`} 
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
                                            onClick={() => handleGenderSelect(g)}
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
                                            onClick={() => handleCategorySelect(c)}
                                        >
                                            {c}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div className={styles.bottomSheetFooter}>
                            <button className={styles.resetBtn} onClick={() => {
                                handleResetAll();
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
