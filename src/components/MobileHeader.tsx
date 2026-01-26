'use client';

import Link from 'next/link';
import { Search } from 'lucide-react';
import styles from './MobileHeader.module.css';

export default function MobileHeader() {
    return (
        <header className={styles.mobileHeader}>
            <div className={styles.leftPlaceholder}>
                {/* Placeholder to balance the search icon, or a menu trigger if we needed one */}
            </div>

            <div className={styles.logo}>
                <Link href="/">OWNER SCENTS</Link>
            </div>

            <div className={styles.actions}>
                <Link href="/shop" className={styles.iconBtn}>
                    <Search size={22} strokeWidth={1.5} />
                </Link>
            </div>
        </header>
    );
}
