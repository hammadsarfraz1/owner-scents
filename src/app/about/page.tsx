import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';

export default function About() {
    return (
        <div className={styles.main}>
            <div className={styles.container}>
                <div className={styles.content}>
                    <span className={styles.tag}>OUR PHILOSOPHY</span>
                    <h1 className={styles.title}>OUR STORY</h1>
                    <p className={styles.text}>
                        Owner Scents was born from a desire to reclaim the narrative of luxury.
                        We believe that true authority comes not from loud proclamations, but from
                        the subtle, undeniable presence of excellence.
                    </p>
                    <p className={styles.text}>
                        Each fragrance is a masterpiece, crafted with the rarest ingredients
                        to evoke power, sophistication, and timeless elegance.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
}
