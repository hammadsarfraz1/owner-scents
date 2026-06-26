'use client';

import { useEffect, useState } from 'react';
import styles from './TopPromoBar.module.css';

export default function TopPromoBar() {
    const [config, setConfig] = useState<any>(null);

    useEffect(() => {
        fetch('/api/homepage-config')
            .then(res => res.json())
            .then(data => setConfig(data))
            .catch(console.error);
    }, []);

    // Default configuration values if not loaded yet or missing
    const showPromo = config ? config.showPromo : true;
    const promoText = config ? config.promoText : "Enjoy Free Shipping on Orders Above Rs. 3,000";

    if (!showPromo) return null;

    return (
        <div className={styles.promoBar}>
            {promoText}
        </div>
    );
}
