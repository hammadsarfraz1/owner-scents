'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCarousel from '@/components/ProductCarousel';
import QuickViewModal from '@/components/QuickViewModal';
import { Product } from '@/components/ProductCard';
import styles from './page.module.css';

let hasSeenIntroGlobal = false;

interface HomeClientProps {
  initialConfig: any;
  initialProducts: any[];
}

export default function HomeClient({ initialConfig, initialProducts }: HomeClientProps) {
  // Parse products on initial load
  const initialPopular = [...initialProducts].sort((a, b) => b.name.length - a.name.length).slice(0, 6);
  const initialLatest = [...initialProducts].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 6);
  
  let exclusive = initialProducts.filter((p: any) => p.isExclusiveOffer === true);
  if (exclusive.length === 0) {
    exclusive = initialProducts.slice(0, 4);
  }
  const initialSale = exclusive.map((p: any) => ({
    ...p,
    isOnSale: true,
    salePrice: p.originalPrice && Number(p.originalPrice) > 0 ? Number(p.price) : Number(p.price) * 0.85
  }));

  let curated = initialProducts.filter((p: any) => p.isCuratedPick === true);
  if (curated.length === 0) {
    curated = initialProducts.slice(0, 6);
  }

  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(curated);
  const [config, setConfig] = useState<any>(initialConfig);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCoverActive, setIsCoverActive] = useState(true);
  const [renderCover, setRenderCover] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'popular' | 'latest'>('popular');
  const [popularProducts, setPopularProducts] = useState<Product[]>(initialPopular);
  const [latestProducts, setLatestProducts] = useState<Product[]>(initialLatest);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>(initialSale);

  const dismissCover = (isClick = false) => {
    if (isCoverActive) {
      if (isClick && typeof window !== 'undefined' && window.innerWidth <= 768) {
        setHoveredCard(null);
        return;
      }
      setIsCoverActive(false);
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('hasSeenIntro', 'true');
      }
      setTimeout(() => {
        setRenderCover(false);
      }, 1000);
    }
  };

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const box = container.getBoundingClientRect();
    const x = e.clientX - box.left;
    const pct = x / box.width;
    
    let slug = 'midnight';
    if (pct < 0.38) {
      slug = 'rose';
    } else if (pct > 0.62) {
      slug = 'velvet';
    }
    
    setHoveredCard(prev => prev !== slug ? slug : prev);
    
    const tiltX = e.clientX - box.left - (box.width / 2);
    const tiltY = e.clientY - box.top - (box.height / 2);
    const factorX = -(tiltY / (box.height / 2)) * 12;
    const factorY = (tiltX / (box.width / 2)) * 12;
    
    container.style.setProperty('--rotate-x', `${factorX}deg`);
    container.style.setProperty('--rotate-y', `${factorY}deg`);
  };

  const handleContainerMouseLeave = (e: React.MouseEvent<HTMLDivElement>) => {
    setHoveredCard(null);
    e.currentTarget.style.setProperty('--rotate-x', '0deg');
    e.currentTarget.style.setProperty('--rotate-y', '0deg');
  };

  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const container = e.currentTarget;
    const box = container.getBoundingClientRect();
    const x = e.clientX - box.left;
    const pct = x / box.width;
    
    let slug = 'midnight';
    if (pct < 0.38) {
      slug = 'rose';
    } else if (pct > 0.62) {
      slug = 'velvet';
    }
    
    setHoveredCard(slug);
  };

  const handleContainerTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    e.stopPropagation();
    const container = e.currentTarget;
    const box = container.getBoundingClientRect();
    const touch = e.touches[0];
    if (!touch) return;
    const x = touch.clientX - box.left;
    const pct = x / box.width;
    
    let slug = 'midnight';
    if (pct < 0.38) {
      slug = 'rose';
    } else if (pct > 0.62) {
      slug = 'velvet';
    }
    
    setHoveredCard(slug);
  };

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined' && sessionStorage.getItem('hasSeenIntro')) {
      setIsCoverActive(false);
      setRenderCover(false);
    }
  }, []);

  useEffect(() => {
    if (isCoverActive) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [isCoverActive]);

  useEffect(() => {
    const handleGesture = (e: WheelEvent) => {
      if (renderCover) {
        e.preventDefault();
        if (isCoverActive && (e.deltaY > 0 || e.deltaY < 0)) {
          dismissCover(false);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (renderCover && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) {
        e.preventDefault();
        if (isCoverActive) {
          dismissCover(false);
        }
      }
    };

    window.addEventListener('wheel', handleGesture, { passive: false });
    window.addEventListener('keydown', handleKeyDown, { passive: false });

    return () => {
      window.removeEventListener('wheel', handleGesture);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [renderCover, isCoverActive]);

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (renderCover) {
        setTouchStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!renderCover) return;
      e.preventDefault();
      if (touchStartY === null || !isCoverActive) return;
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;

      if (Math.abs(diffY) > 50) {
        dismissCover(false);
        setTouchStartY(null);
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [renderCover, isCoverActive, touchStartY]);

  useEffect(() => {
    setIsLoaded(true);

    // Dynamic sync in background to make sure we stay perfectly up to date
    fetch('/api/products?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        const popular = [...data].sort((a, b) => b.name.length - a.name.length).slice(0, 6);
        setPopularProducts(popular);

        const latest = [...data].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 6);
        setLatestProducts(latest);

        let exclusive = data.filter((p: any) => p.isExclusiveOffer === true);
        if (exclusive.length === 0) {
          exclusive = data.slice(0, 4);
        }
        const sale = exclusive.map((p: any) => ({
          ...p,
          isOnSale: true,
          salePrice: p.originalPrice && Number(p.originalPrice) > 0 ? Number(p.price) : Number(p.price) * 0.85
        }));
        setOnSaleProducts(sale);

        let curated = data.filter((p: any) => p.isCuratedPick === true);
        if (curated.length === 0) {
          curated = data.slice(0, 6);
        }
        setFeaturedProducts(curated);
      })
      .catch(console.error);

    fetch('/api/homepage-config?t=' + Date.now())
      .then(res => res.json())
      .then(data => setConfig(data))
      .catch(console.error);
  }, []);

  const testimonials = [
    {
      quote: "Midnight Oud is absolute perfection. It's bold, complex, and commands attention the moment you walk into the room.",
      author: "Aron K.",
      role: "Founder, Apex Capital"
    },
    {
      quote: "Rose Elixir has become my signature scent. It strikes the perfect balance between delicate floral notes and rich vanilla warmth.",
      author: "Elena R.",
      role: "Creative Director"
    },
    {
      quote: "These aren't just perfumes; they are olfactory statements. The packaging, bottle, and scent longevity are unmatched.",
      author: "Marcus V.",
      role: "Collector & Critic"
    }
  ];

  const getVal = (val: string | undefined, defaultVal: string) => val !== undefined ? val : defaultVal;

  const rawHeroTitle = getVal(config?.heroTitle, "ESSENCE OF AUTHORITY");
  const titleWords = rawHeroTitle ? rawHeroTitle.split(' ') : [];
  const mainTitle = titleWords.length > 1 ? titleWords.slice(0, -1).join(' ') : (titleWords[0] || '');
  const lastWord = titleWords.length > 1 ? titleWords[titleWords.length - 1] : '';

  if (!mounted) {
    return <div style={{ background: '#050506', minHeight: '100vh' }} />;
  }

  return (
    <div className={styles.main}>
      {/* Intro Curtain Cover (Option A) */}
      {renderCover && (
        <div 
          className={`${styles.introCover} ${!isCoverActive ? styles.introCoverSlideUp : ''}`}
          onClick={() => dismissCover(true)}
        >
          <div className={styles.introContent}>
            <span className={styles.introTag}>THE HAUTE PARFUMERIE</span>
            <h2 className={styles.introTitle}>Select Your Olfactory Statement</h2>

            <div 
              className={`${styles.stackContainer} ${styles.introStackContainer}`}
              onMouseMove={handleContainerMouseMove}
              onMouseLeave={handleContainerMouseLeave}
              onClick={handleContainerClick}
              onTouchStart={handleContainerTouchStart}
            >
              {[
                {
                  slug: 'rose',
                  name: config?.card1Name || "Rose Elixir",
                  edition: config?.card1Edition || "FLORAL ESSENCE",
                  image: config?.card1Image || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
                  className: styles.leftCard
                },
                {
                  slug: 'midnight',
                  name: config?.card2Name || "Midnight OUD",
                  edition: config?.card2Edition || "SIGNATURE EDITION",
                  image: config?.card2Image || "https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&w=800&q=80",
                  className: styles.centerCard
                },
                {
                  slug: 'velvet',
                  name: config?.card3Name || "Velvet Orchid",
                  edition: config?.card3Edition || "ROYAL ORIENTAL",
                  image: config?.card3Image || "https://images.unsplash.com/photo-1588405765098-936d50953d7e?auto=format&fit=crop&w=800&q=80",
                  className: styles.rightCard
                }
              ].map((perfume) => {
                const isActive = hoveredCard === perfume.slug;
                
                return (
                  <div 
                    key={perfume.slug}
                    className={`${styles.stackCard} ${perfume.className} ${isActive ? styles.activeCard : ''} ${isLoaded ? styles.cardLoaded : ''}`}
                    style={{
                      cursor: 'default'
                    } as React.CSSProperties}
                    onClick={(e) => {
                      e.stopPropagation();
                      setHoveredCard(perfume.slug);
                    }}
                  >
                    <div className={styles.cardGlow} />
                    <div className={styles.cardInner}>
                      <img
                        src={perfume.image}
                        alt={perfume.name}
                        style={{
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover'
                        }}
                      />
                      <div className={styles.cardContent}>
                        <h3>{perfume.name}</h3>
                        <span>{perfume.edition}</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className={styles.scrollIndicator} onClick={() => dismissCover(true)}>
              <span className={styles.scrollText}>
                {mounted && typeof window !== 'undefined' && window.innerWidth <= 768 
                  ? 'Scroll to enter' 
                  : 'Scroll or click to enter'}
              </span>
              <span className={styles.scrollArrow}>↓</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      {config?.showHero !== false && (
        <section className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <div className={styles.heroLeft}>
              <span className={`${styles.heroTagline} animateFadeInUp`}>THE HAUTE PARFUMERIE</span>
              {rawHeroTitle && (
                <h1 className={`${styles.title} animateFadeInUp delay100`}>
                  {mainTitle}{lastWord ? <><br /><span className={styles.glowingText}>{lastWord}</span></> : ''}
                </h1>
              )}
              {getVal(config?.heroSubtitle, "Curating timeless fragrance collections for the distinguished individual.") && (
                <p className={`${styles.subtitle} animateFadeInUp delay200`}>{getVal(config?.heroSubtitle, "Curating timeless fragrance collections for the distinguished individual.")}</p>
              )}
              <div className={`${styles.heroActions} animateFadeInUp delay300`}>
                {getVal(config?.heroButtonText, "Shop Collection") && (
                  <Link href="/shop" className="btn sheenEffect">{getVal(config?.heroButtonText, "Shop Collection")}</Link>
                )}
                {getVal(config?.heroScentFinderButtonText, "Find Your Scent") && (
                  <Link href="/scent-finder" className={styles.secondaryBtn}>{getVal(config?.heroScentFinderButtonText, "Find Your Scent")}</Link>
                )}
              </div>
            </div>

            <div className={styles.heroRight}>
              <div 
                className={styles.stackContainer}
                onMouseMove={handleContainerMouseMove}
                onMouseLeave={handleContainerMouseLeave}
              >
                {[
                  {
                    slug: 'rose',
                    name: getVal(config?.card1Name, "Rose Elixir"),
                    edition: getVal(config?.card1Edition, "FLORAL ESSENCE"),
                    image: getVal(config?.card1Image, "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80"),
                    link: getVal(config?.card1Link, "/shop"),
                    className: styles.leftCard
                  },
                  {
                    slug: 'midnight',
                    name: getVal(config?.card2Name, "Midnight OUD"),
                    edition: getVal(config?.card2Edition, "SIGNATURE EDITION"),
                    image: getVal(config?.card2Image, "https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&w=800&q=80"),
                    link: getVal(config?.card2Link, "/shop"),
                    className: styles.centerCard
                  },
                  {
                    slug: 'velvet',
                    name: getVal(config?.card3Name, "Velvet Orchid"),
                    edition: getVal(config?.card3Edition, "ROYAL ORIENTAL"),
                    image: getVal(config?.card3Image, "https://images.unsplash.com/photo-1588405765098-936d50953d7e?auto=format&fit=crop&w=800&q=80"),
                    link: getVal(config?.card3Link, "/shop"),
                    className: styles.rightCard
                  }
                ].map((perfume) => {
                  const matchedProduct = featuredProducts.find(p => p.name.toLowerCase().trim() === perfume.name.toLowerCase().trim());
                  const linkHref = matchedProduct ? `/shop/${matchedProduct.id}` : perfume.link;
                  const isActive = hoveredCard === perfume.slug;
                  
                  return (
                    <Link 
                      key={perfume.slug}
                      href={linkHref}
                      className={`${styles.stackCard} ${perfume.className} ${isActive ? styles.activeCard : ''} ${isLoaded ? styles.cardLoaded : ''}`}
                      style={{
                        cursor: 'pointer'
                      } as React.CSSProperties}
                    >
                      <div className={styles.cardGlow} />
                      <div className={styles.cardInner}>
                        <img
                          src={perfume.image}
                          alt={perfume.name}
                          style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                          }}
                        />
                        <div className={styles.cardContent}>
                          {perfume.name && <h3>{perfume.name}</h3>}
                          {perfume.edition && <span>{perfume.edition}</span>}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Marquee Stripe */}
      {config?.showMarquee !== false && getVal(config?.marqueeText, "LUXURY • TIMELESS • ELEGANCE • BOLDNESS • ") && (
        <div className={styles.marquee}>
          <div className={styles.track}>
            {Array(4).fill(getVal(config?.marqueeText, "LUXURY • TIMELESS • ELEGANCE • BOLDNESS • ")).map((text, i) => (
              <span key={i}>{text}</span>
            ))}
          </div>
        </div>
      )}

      {/* Categories Split */}
      <section className={styles.categories}>
        <Link 
          href={getVal(config?.split1Link, "/shop?gender=Men")} 
          className={`${styles.catCard}`}
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(${getVal(config?.split1Image, 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1000&q=80')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className={styles.catOverlay} />
          {getVal(config?.split1Title, "FOR HIM") && <span className={styles.catTitle}>{getVal(config?.split1Title, "FOR HIM")}</span>}
        </Link>
        <Link 
          href={getVal(config?.split2Link, "/shop?gender=Women")} 
          className={`${styles.catCard}`}
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(${getVal(config?.split2Image, 'https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&w=1000&q=80')})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className={styles.catOverlay} />
          {getVal(config?.split2Title, "FOR HER") && <span className={styles.catTitle}>{getVal(config?.split2Title, "FOR HER")}</span>}
        </Link>
      </section>

      {/* On Sale Section */}
      {config?.showSale !== false && (
        <section className={`container ${styles.featuredSection}`}>
          <div className={styles.featuredHeader}>
            {getVal(config?.saleLabel, "EXCLUSIVE OFFER") && (
              <span className={styles.saleTagline} style={{ color: '#ef4444', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', textShadow: '0 0 10px rgba(239, 68, 68, 0.3)', display: 'block', marginBottom: '0.5rem' }}>
                {getVal(config?.saleLabel, "EXCLUSIVE OFFER")}
              </span>
            )}
            {getVal(config?.saleTitle, "Limited-Time Sale") && <h2 style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.15)' }}>{getVal(config?.saleTitle, "Limited-Time Sale")}</h2>}
            {getVal(config?.saleSubtitle, "Exceptional values on our most coveted fragrances. Available for a limited duration.") && (
              <p>{getVal(config?.saleSubtitle, "Exceptional values on our most coveted fragrances. Available for a limited duration.")}</p>
            )}
          </div>

          <ProductCarousel 
            products={onSaleProducts} 
            title="" 
            onQuickView={setQuickViewProduct} 
          />
        </section>
      )}

      {/* Explore Collections Section (Popular / Latest) */}
      {config?.showExplore !== false && (
        <section className={`container ${styles.featuredSection}`}>
          <div className={styles.featuredHeader}>
            {getVal(config?.exploreTitle, "Explore Collections") && <h2>{getVal(config?.exploreTitle, "Explore Collections")}</h2>}
            {getVal(config?.exploreSubtitle, "Discover our highly acclaimed and newly arrived fragrances.") && (
              <p>{getVal(config?.exploreSubtitle, "Discover our highly acclaimed and newly arrived fragrances.")}</p>
            )}

            <div className={styles.tabContainer}>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'popular' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('popular')}
              >
                Popular
              </button>
              <button 
                className={`${styles.tabBtn} ${activeTab === 'latest' ? styles.activeTab : ''}`}
                onClick={() => setActiveTab('latest')}
              >
                Latest
              </button>
            </div>
          </div>

          <ProductCarousel 
            key={activeTab}
            products={
              activeTab === 'popular' ? popularProducts :
              latestProducts
            } 
            title="" 
            onQuickView={setQuickViewProduct} 
          />
        </section>
      )}

      {/* Testimonials Banner */}
      {config?.showTestimonials !== false && (
        <section className={`container ${styles.featuredSection}`} style={{ background: '#09090b', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', maxWidth: '100%', width: '100%', padding: '6rem 2rem' }}>
          <div className={styles.featuredHeader}>
            <span className={styles.sectionTagline}>{getVal(config?.testimonialsTitle, "Olfactory Appraisals")}</span>
            <h2>Connoisseur Appraisals</h2>
            <p>{getVal(config?.testimonialsSubtitle, "What the connoisseurs say about Owner Scents.")}</p>
          </div>

          <div className={`container ${styles.testimonialsGrid}`}>
            {testimonials.map((t, idx) => (
              <div key={idx} className={styles.testimonialCard}>
                <div className={styles.ratingStars}>★★★★★</div>
                <p className={styles.quoteText}>"{t.quote}"</p>
                <div className={styles.authorGroup}>
                  <span className={styles.authorName}>{t.author}</span>
                  <span className={styles.authorRole}>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Quick View Modal */}
      {quickViewProduct && (
        <QuickViewModal 
          product={quickViewProduct} 
          onClose={() => setQuickViewProduct(null)} 
        />
      )}

      <Footer />
    </div>
  );
}
