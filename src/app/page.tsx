'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
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
      .then(data => setFeaturedProducts(data.slice(0, 3)))
      .catch(console.error);
  }, []);

  return (
    <div className={styles.main}>
      <Navbar />

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>ESSENCE OF <br /> AUTHORITY.</h1>
          <p className={styles.subtitle}>Discover the scent that defines you.</p>
          <Link href="/shop" className="btn">Shop Collection</Link>
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

      {/* Featured Section */}
      <section className="container">
        <div className={styles.featuredHeader}>
          <h2>Signature Scents</h2>
          <p>Curated for the distinguished.</p>
        </div>

        <div className={styles.grid}>
          {featuredProducts.map((product) => (
            <div key={product.id} className={styles.card}>
              <Link href={`/shop/${product.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                <div className={styles.imagePlaceholder}>
                  <span>{product.name}</span>
                </div>
                <div className={styles.cardInfo}>
                  <h3>{product.name}</h3>
                  <p>${Number(product.price).toFixed(2)}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '4rem' }}>
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
