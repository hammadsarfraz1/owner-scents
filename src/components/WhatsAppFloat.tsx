'use client';

import { useState } from 'react';
import { MessageCircle, X } from 'lucide-react';
import styles from './WhatsAppFloat.module.css';

export default function WhatsAppFloat() {
    const [isOpen, setIsOpen] = useState(false);

    const options = [
        { label: "Help me select a fragrance", text: "Hello! I would love to get some guidance in selecting a luxury fragrance that suits my tastes." },
        { label: "Order status & tracking", text: "Hello! I would like to check the status of my order." },
        { label: "Corporate gifting / Bulk orders", text: "Hello! I am interested in corporate gifting or bulk purchasing options." },
        { label: "Chat with an advisor", text: "Hello! I have a question and would like to speak with a fragrance advisor." }
    ];

    return (
        <div className={styles.container}>
            {isOpen && (
                <div className={styles.conciergeCard}>
                    <div className={styles.conciergeHeader}>
                        <div className={styles.avatarWrapper}>
                            <MessageCircle size={20} className={styles.avatarIcon} />
                            <span className={styles.statusIndicator} />
                        </div>
                        <div className={styles.headerInfo}>
                            <h4>Scent Concierge</h4>
                            <span>Online • Ready to assist</span>
                        </div>
                        <button onClick={() => setIsOpen(false)} className={styles.closeBtn} aria-label="Close concierge">
                            <X size={16} />
                        </button>
                    </div>
                    <div className={styles.conciergeBody}>
                        <p className={styles.welcomeText}>
                            Welcome to Owner Scents. Select an option below to start chatting with our fragrance advisor on WhatsApp:
                        </p>
                        <div className={styles.optionsList}>
                            {options.map((opt, i) => (
                                <a
                                    key={i}
                                    href={`https://wa.me/1234567890?text=${encodeURIComponent(opt.text)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.optionLink}
                                    onClick={() => setIsOpen(false)}
                                >
                                    <span>{opt.label}</span>
                                    <span className={styles.arrow}>&rarr;</span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`${styles.whatsappFloat} ${isOpen ? styles.active : ''}`}
                aria-label="Toggle Scent Concierge"
            >
                {isOpen ? <X size={26} /> : <MessageCircle size={28} />}
            </button>
        </div>
    );
}
