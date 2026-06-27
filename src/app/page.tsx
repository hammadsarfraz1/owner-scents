'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCarousel from '@/components/ProductCarousel';
import QuickViewModal from '@/components/QuickViewModal';
import { Product } from '@/components/ProductCard';
import styles from './page.module.css';

let hasSeenIntroGlobal = false;

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [config, setConfig] = useState<any>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [isCoverActive, setIsCoverActive] = useState(!hasSeenIntroGlobal);
  const [renderCover, setRenderCover] = useState(!hasSeenIntroGlobal);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState<'popular' | 'latest'>('popular');
  const [popularProducts, setPopularProducts] = useState<Product[]>([]);
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [onSaleProducts, setOnSaleProducts] = useState<Product[]>([]);

  const handleContainerMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const box = container.getBoundingClientRect();
    
    const tiltX = e.clientX - box.left - (box.width / 2);
    const tiltY = e.clientY - box.top - (box.height / 2);
    const factorX = -(tiltY / (box.height / 2)) * 12;
    const factorY = (tiltX / (box.width / 2)) * 12;
    
    setTilt({ x: factorX, y: factorY });
  };

  const handleContainerMouseLeave = () => {
    setHoveredCard(null);
    setTilt({ x: 0, y: 0 });
  };

  // Body overflow locking while intro cover is active or sliding out
  useEffect(() => {
    if (renderCover) {
      document.documentElement.style.overflow = 'hidden';
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none';
    } else {
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
  }, [renderCover]);

  // Handle scroll down / scroll up curtain toggle
  useEffect(() => {
    const handleGesture = (e: WheelEvent) => {
      if (renderCover) {
        e.preventDefault(); // Block main page from scrolling at all costs
        if (isCoverActive && (e.deltaY > 0 || e.deltaY < 0)) {
          setIsCoverActive(false);
          hasSeenIntroGlobal = true;
          setTimeout(() => {
            setRenderCover(false);
          }, 1000);
        }
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (renderCover && (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ')) {
        e.preventDefault(); // Block page scroll
        if (isCoverActive) {
          setIsCoverActive(false);
          hasSeenIntroGlobal = true;
          setTimeout(() => {
            setRenderCover(false);
          }, 1000);
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

  // Touch event listeners for mobile swipe to trigger curtain
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (renderCover) {
        setTouchStartY(e.touches[0].clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (!renderCover) return;
      e.preventDefault(); // Block touch page scroll completely
      if (touchStartY === null || !isCoverActive) return;
      const currentY = e.touches[0].clientY;
      const diffY = touchStartY - currentY;

      if (Math.abs(diffY) > 20) {
        setIsCoverActive(false);
        hasSeenIntroGlobal = true;
        setTouchStartY(null);
        setTimeout(() => {
          setRenderCover(false);
        }, 1000);
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

    fetch('/api/products?t=' + Date.now())
      .then(res => res.json())
      .then(data => {
        // 1. Popular: Sort by length of name to mix signature and popular items
        const popular = [...data].sort((a, b) => b.name.length - a.name.length).slice(0, 6);
        setPopularProducts(popular);

        // 2. Latest: Sort by createdAt descending
        const latest = [...data].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 6);
        setLatestProducts(latest);

        // 3. On Sale / Exclusive Offer: Selected by Admin in Admin Panel
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

        setFeaturedProducts(data.slice(0, 6));
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

  const titleWords = (config?.heroTitle || "ESSENCE OF AUTHORITY").split(' ');
  const mainTitle = titleWords.slice(0, -1).join(' ');
  const lastWord = titleWords[titleWords.length - 1] || '';

  const dismissCover = () => {
    if (isCoverActive) {
      setIsCoverActive(false);
      hasSeenIntroGlobal = true;
      setTimeout(() => {
        setRenderCover(false);
      }, 1000);
    }
  };

  return (
    <div className={styles.main}>
      {/* Intro Curtain Cover (Option A) */}
      {renderCover && (
        <div 
          className={`${styles.introCover} ${!isCoverActive ? styles.introCoverSlideUp : ''}`}
          onClick={dismissCover}
        >
          <div className={styles.introContent} onClick={(e) => e.stopPropagation()}>
            <span className={styles.introTag}>THE HAUTE PARFUMERIE</span>
            <h2 className={styles.introTitle}>Select Your Olfactory Statement</h2>

            <div 
              className={`${styles.stackContainer} ${styles.introStackContainer}`}
              onMouseMove={handleContainerMouseMove}
              onMouseLeave={handleContainerMouseLeave}
            >
              {[
                {
                  slug: 'rose',
                  name: config?.card1Name || "Rose Elixir",
                  edition: config?.card1Edition || "FLORAL ESSENCE",
                  image: config?.card1Image || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
                  link: config?.card1Link || "/shop",
                  className: styles.leftCard
                },
                {
                  slug: 'midnight',
                  name: config?.card2Name || "Midnight OUD",
                  edition: config?.card2Edition || "SIGNATURE EDITION",
                  image: config?.card2Image || "https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&w=800&q=80",
                  link: config?.card2Link || "/shop",
                  className: styles.centerCard
                },
                {
                  slug: 'velvet',
                  name: config?.card3Name || "Velvet Orchid",
                  edition: config?.card3Edition || "ROYAL ORIENTAL",
                  image: config?.card3Image || "https://images.unsplash.com/photo-1588405765098-936d50953d7e?auto=format&fit=crop&w=800&q=80",
                  link: config?.card3Link || "/shop",
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
                    onMouseEnter={() => setHoveredCard(perfume.slug)}
                    className={`${styles.stackCard} ${perfume.className} ${isActive ? styles.activeCard : ''} ${isLoaded ? styles.cardLoaded : ''}`}
                    style={{
                      '--rotate-x': isActive ? `${tilt.x}deg` : '0deg',
                      '--rotate-y': isActive ? `${tilt.y}deg` : '0deg',
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
                        <h3>{perfume.name}</h3>
                        <span>{perfume.edition}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            <div className={styles.scrollIndicator} onClick={dismissCover}>
              <span className={styles.scrollText}>Scroll or click to enter</span>
              <span className={styles.scrollArrow}>↓</span>
            </div>
          </div>
        </div>
      )}

      <Navbar />

      {/* Hero Section */}
      {config?.showHero !== false && (
        <section className={styles.hero}>
          <div className={`container ${styles.heroContainer}`}>
            <div className={styles.heroLeft}>
              <span className={`${styles.heroTagline} animateFadeInUp`}>THE HAUTE PARFUMERIE</span>
              <h1 className={`${styles.title} animateFadeInUp delay100`}>
                {mainTitle}<br />
                <span className={styles.glowingText}>{lastWord}</span>
              </h1>
              <p className={`${styles.subtitle} animateFadeInUp delay200`}>{config?.heroSubtitle || "Curating timeless fragrance collections for the distinguished individual."}</p>
              <div className={`${styles.heroActions} animateFadeInUp delay300`}>
                <Link href="/shop" className="btn sheenEffect">{config?.heroButtonText || "Shop Collection"}</Link>
                <Link href="/scent-finder" className={styles.secondaryBtn}>{config?.heroScentFinderButtonText || "Find Your Scent"}</Link>
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
                    name: config?.card1Name || "Rose Elixir",
                    edition: config?.card1Edition || "FLORAL ESSENCE",
                    image: config?.card1Image || "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
                    link: config?.card1Link || "/shop",
                    className: styles.leftCard
                  },
                  {
                    slug: 'midnight',
                    name: config?.card2Name || "Midnight OUD",
                    edition: config?.card2Edition || "SIGNATURE EDITION",
                    image: config?.card2Image || "https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&w=800&q=80",
                    link: config?.card2Link || "/shop",
                    className: styles.centerCard
                  },
                  {
                    slug: 'velvet',
                    name: config?.card3Name || "Velvet Orchid",
                    edition: config?.card3Edition || "ROYAL ORIENTAL",
                    image: config?.card3Image || "https://images.unsplash.com/photo-1588405765098-936d50953d7e?auto=format&fit=crop&w=800&q=80",
                    link: config?.card3Link || "/shop",
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
                      onMouseEnter={() => setHoveredCard(perfume.slug)}
                      className={`${styles.stackCard} ${perfume.className} ${isActive ? styles.activeCard : ''} ${isLoaded ? styles.cardLoaded : ''}`}
                      style={{
                        '--rotate-x': isActive ? `${tilt.x}deg` : '0deg',
                        '--rotate-y': isActive ? `${tilt.y}deg` : '0deg',
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
                          <h3>{perfume.name}</h3>
                          <span>{perfume.edition}</span>
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
      {config?.showMarquee !== false && (
        <div className={styles.marquee}>
          <div className={styles.track}>
            {Array(4).fill(config?.marqueeText || "LUXURY • TIMELESS • ELEGANCE • BOLDNESS • ").map((text, i) => (
              <span key={i}>{text}</span>
            ))}
          </div>
        </div>
      )}

      {/* Categories Split */}
      <section className={styles.categories}>
        <Link 
          href={config?.split1Link || "/shop?gender=Men"} 
          className={`${styles.catCard}`}
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(${config?.split1Image || 'https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=1000&q=80'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className={styles.catOverlay} />
          <span className={styles.catTitle}>{config?.split1Title || "FOR HIM"}</span>
        </Link>
        <Link 
          href={config?.split2Link || "/shop?gender=Women"} 
          className={`${styles.catCard}`}
          style={{ 
            backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.15), rgba(0, 0, 0, 0.15)), url(${config?.split2Image || 'https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&w=1000&q=80'})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        >
          <div className={styles.catOverlay} />
          <span className={styles.catTitle}>{config?.split2Title || "FOR HER"}</span>
        </Link>
      </section>

      {/* On Sale Section */}
      {config?.showSale !== false && (
        <section className={`container ${styles.featuredSection}`}>
          <div className={styles.featuredHeader}>
            <span className={styles.saleTagline} style={{ color: '#ef4444', letterSpacing: '4px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', textShadow: '0 0 10px rgba(239, 68, 68, 0.3)', display: 'block', marginBottom: '0.5rem' }}>
              {config?.saleLabel || "EXCLUSIVE OFFER"}
            </span>
            <h2 style={{ textShadow: '0 0 20px rgba(239, 68, 68, 0.15)' }}>{config?.saleTitle || "Limited-Time Sale"}</h2>
            <p>{config?.saleSubtitle || "Exceptional values on our most coveted fragrances. Available for a limited duration."}</p>
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
        <section className={`container ${styles.featuredSection}`} style={{ paddingTop: 0 }}>
          <div className={styles.featuredHeader}>
            <h2>{config?.exploreTitle || "Explore Collections"}</h2>
            <p>{config?.exploreSubtitle || "Discover our highly acclaimed and newly arrived fragrances."}</p>

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

      {/* Signature Scents Section */}
      {config?.showSignature !== false && (
        <section className={`container ${styles.featuredSection}`} style={{ paddingTop: 0 }}>
          <div className={styles.featuredHeader}>
            <h2>{config?.signatureTitle || "Signature Scents"}</h2>
            <p>{config?.signatureSubtitle || "Hand-crafted fragrances curated for modern authority."}</p>
          </div>

          <ProductCarousel 
            products={featuredProducts} 
            title="" 
            onQuickView={setQuickViewProduct} 
          />

          <div style={{ textAlign: 'center', marginTop: '3rem', marginBottom: '4rem' }}>
            <Link href="/shop" className={styles.viewAllBtn}>{config?.signatureButtonText || "Explore Full Catalog"}</Link>
          </div>
        </section>
      )}

      {/* Story Teaser */}
      {config?.showStory !== false && (
        <section className={styles.story}>
          <div className={styles.storyOverlay} />
          <div className={styles.storyContent}>
            <span className={styles.storyLabel}>{config?.storyLabel || "OUR LEGACY"}</span>
            <h2>{config?.storyTitle || "The Owner's Story"}</h2>
            <p>{config?.storyDescription || "Crafted for those who walk into a room and own it without saying a word. Our fragrances are designed to make an indelible mark, using rarest natural extracts sourced from around the globe."}</p>
            <Link href="/about" className={styles.storyLink}>{config?.storyButtonText || "Read Our Philosophy"}</Link>
          </div>
        </section>
      )}

      {/* Testimonials Section */}
      {config?.showTestimonials !== false && (
        <section className={`container ${styles.testimonialsSection}`}>
          <div className={styles.featuredHeader}>
            <h2>{config?.testimonialsTitle || "Client Appraisals"}</h2>
            <p>{config?.testimonialsSubtitle || "What the connoisseurs say about Owner Scents."}</p>
          </div>
          <div className={styles.testimonialsGrid}>
            {testimonials.map((t, idx) => (
              <div key={idx} className={styles.testimonialCard}>
                <div className={styles.quoteIcon}>“</div>
                <p className={styles.quoteText}>{t.quote}</p>
                <div className={styles.quoteAuthor}>
                  <strong>{t.author}</strong>
                  <span>{t.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />

      <Footer />
    </div>
  );
}
