'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './HeroSearch.module.css';

export default function HeroSearch() {
    const [term, setTerm] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (term.trim()) {
            router.push(`/shop?search=${encodeURIComponent(term)}`);
        }
    };

    return (
        <form className={styles.wrapper} onSubmit={handleSearch}>
            <input
                type="text"
                placeholder="Search for scents..."
                className={styles.input}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
            />
            <button type="submit" className={styles.button}>
                🔍
            </button>
        </form>
    );
}
