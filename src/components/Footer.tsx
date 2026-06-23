'use client';
import styles from './Footer.module.css';

export default function Footer() {
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
                        <a href="/shop">New Arrivals</a>
                        <a href="/shop">Best Sellers</a>
                        <a href="/shop">Signature Ouds</a>
                    </div>
                    <div className={styles.column}>
                        <h4>Brand</h4>
                        <a href="/about">Our Story</a>
                        <a href="/about">Scent Philosophy</a>
                        <a href="/scent-finder">Scent Finder</a>
                    </div>
                    <div className={styles.column}>
                        <h4>Assistance</h4>
                        <a href="#">Shipping & Returns</a>
                        <a href="#">Contact Concierge</a>
                        <a href="#">Privacy Policy</a>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; {new Date().getFullYear()} Owner Scents. All rights reserved.</p>
            </div>
        </footer>
    );
}
