'use client';
import { useEffect, useState } from 'react';
import styles from './Footer.module.css';

type FooterPageItem = {
    id: string;
    slug: string;
    title: string;
};

export default function Footer() {
    const [pages, setPages] = useState<FooterPageItem[]>([]);

    useEffect(() => {
        fetch('/api/footer-pages?t=' + Date.now())
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setPages(data);
                }
            })
            .catch(console.error);
    }, []);

    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h3 className={styles.logo}>OWNER SCENTS</h3>
                    <p className={styles.tagline}>Redefining luxury through the essence of authority.</p>
                    <div className={styles.newsletter}>
                        <h4>Subscribe to Exclusive Pre-releases</h4>
                        <form className={styles.newsletterForm} onSubmit={(e) => e.preventDefault()}>
                            <input 
                                type="email" 
                                placeholder="Your Email Address" 
                                className={styles.newsletterInput} 
                                required
                            />
                            <button type="submit" className={styles.newsletterBtn}>Join</button>
                        </form>
                    </div>
                </div>
                <div className={styles.links}>
                    <div className={styles.column}>
                        <h4>Shop</h4>
                        <a href="/shop?sort=latest">New Arrivals</a>
                        <a href="/shop?sort=popular">Best Sellers</a>
                        <a href="/shop?category=curated-pick">Curated Pick</a>
                    </div>
                    <div className={styles.column}>
                        <h4>Concierge</h4>
                        {pages.map((page) => (
                            <a key={page.id} href={`/${page.slug}`}>
                                {page.title}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} Owner Scents. All rights reserved.</p>
            </div>
        </footer>
    );
}
