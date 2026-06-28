'use client';

import TopPromoBar from './TopPromoBar';
import Navbar from './Navbar';
import MobileHeader from './MobileHeader';
import styles from './MainHeader.module.css';

export default function MainHeader({ onSearch }: { onSearch?: (term: string) => void }) {
    return (
        <header className={styles.stickyHeaderGroup}>
            <TopPromoBar />
            <Navbar onSearch={onSearch} />
            <MobileHeader />
        </header>
    );
}
