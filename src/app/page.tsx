'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import HeroSearch from '@/components/HeroSearch';
import ProductCarousel from '@/components/ProductCarousel';
import styles from './page.module.css';

type Product = {
  id: string;
  name: string;
  price: string;
  image: string;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => setFeaturedProducts(data.slice(0, 6))) // Fetch more for carousel
      .catch(console.error);
  }, []);

  return (
    <div className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        {/* Background Image */}
        <div className={styles.heroBg}>
          <Image
            src="/hero-new.png"
            alt="Luxury Perfume"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className={styles.overlay} />
        </div>

        <div className={styles.heroContent}>
          <h1 className={styles.title}>ESSENCE OF <br /> AUTHORITY.</h1>
          <p className={styles.subtitle}>Discover the scent that defines you.</p>

          {/* New Search Bar removed as per request */}
          {/* <HeroSearch /> */}

          <div style={{ marginTop: '2rem' }}>
            <Link href="/shop" className="btn">Shop Collection</Link>
          </div>
        </div>
      </section>

      {/* Marquee Stripe */}
      <div className={styles.marquee}>
        <div className={styles.track}>
          <span>LUXURY • TIMELESS • ELEGANCE • BOLDNESS • </span>
          <span>LUXURY • TIMELESS • ELEGANCE • BOLDNESS • </span>
          <span>LUXURY • TIMELESS • ELEGANCE • BOLDNESS • </span>
          <span>LUXURY • TIMELESS • ELEGANCE • BOLDNESS • </span>
        </div>
      </div>

      {/* Categories Split */}
      <section className={styles.categories}>
        <Link href="/shop?gender=Men" className={`${styles.catCard} ${styles.men}`}>
          <span className={styles.catTitle}>FOR HIM</span>
        </Link>
        <Link href="/shop?gender=Women" className={`${styles.catCard} ${styles.women}`}>
          <span className={styles.catTitle}>FOR HER</span>
        </Link>
      </section>

      {/* Featured Section - NOW CAROUSEL */}
      <section className="container">
        <div className={styles.featuredHeader}>
          <h2>Signature Scents</h2>
          <p>Curated for the distinguished.</p>
        </div>

        {/* Replaced Grid with Carousel */}
        <ProductCarousel products={featuredProducts} title="" />

        <div style={{ textAlign: 'center', marginTop: '2rem', marginBottom: '4rem' }}>
          <Link href="/shop" className={styles.secondaryBtn}>View All Products</Link>
        </div>
      </section>

      {/* Story Teaser */}
      <section className={styles.story}>
        <div className={styles.storyContent}>
          <h2>The Owner's Story</h2>
          <p>Crafted for those who walk into a room and own it without saying a word. Our fragrances are not just scents; they are a statement of power and prestige.</p>
          <Link href="/about" style={{ textDecoration: 'underline' }}>Read Our Philosophy</Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
