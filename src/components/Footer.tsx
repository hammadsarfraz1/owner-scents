import styles from './Footer.module.css';

export default function Footer() {
    return (
        <footer className={styles.footer}>
            <div className={styles.container}>
                <div className={styles.brand}>
                    <h3>OWNER SCENTS</h3>
                    <p>Redefining luxury through essence.</p>
                </div>
                <div className={styles.links}>
                    <div className={styles.column}>
                        <h4>Shop</h4>
                        <a href="#">New Arrivals</a>
                        <a href="#">Best Sellers</a>
                        <a href="#">Gift Sets</a>
                    </div>
                    <div className={styles.column}>
                        <h4>Help</h4>
                        <a href="#">Shipping</a>
                        <a href="#">Returns</a>
                        <a href="#">Contact</a>
                    </div>
                    <div className={styles.column}>
                        <h4>Follow Us</h4>
                        <a href="#">Instagram</a>
                        <a href="#">Twitter</a>
                        <a href="#">TikTok</a>
                    </div>
                </div>
            </div>
            <div className={styles.bottom}>
                <p>&copy; 2025 Owner Scents. All rights reserved.</p>
            </div>
        </footer>
    );
}
