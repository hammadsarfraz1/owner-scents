'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';

type Product = {
    id: string;
    name: string;
    price: string;
    image: string;
    description: string;
    gender: string;
    category: string;
    topNotes: string;
    heartNotes: string;
    baseNotes: string;
};

type Question = {
    id: number;
    text: string;
    options: {
        text: string;
        value: string;
        description: string;
    }[];
};

export default function ScentFinder() {
    const [step, setStep] = useState(0); // 0: Intro, 1-3: Questions, 4: Result
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [recommended, setRecommended] = useState<Product | null>(null);
    const { addToCart } = useCart();

    useEffect(() => {
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(console.error);
    }, []);

    const questions: Question[] = [
        {
            id: 1,
            text: "Which olfactory atmosphere speaks to your soul?",
            options: [
                { text: "Vibrant & Crisp", value: "Fresh", description: "Zesty citrus, marine breezes, clean linen." },
                { text: "Deep & Mysterious", value: "Woody", description: "Smoky resins, warm leather, ancient woods." },
                { text: "Sensual & Velvet", value: "Floral", description: "Blooming roses, black orchids, sweet vanilla." }
            ]
        },
        {
            id: 2,
            text: "When does your signature scent need to perform?",
            options: [
                { text: "Daytime Authority", value: "day", description: "Office meetings, casual gatherings, clean presence." },
                { text: "Night-time Command", value: "night", description: "VIP events, intimate dinners, bold projections." },
                { text: "All-Season Signature", value: "all", description: "Timeless versatility, adapting to your warmth." }
            ]
        },
        {
            id: 3,
            text: "What key note represents your personal authority?",
            options: [
                { text: "Leather & Agarwood (Oud)", value: "oud", description: "Opulent, dry, intense, authoritative." },
                { text: "Sea Salt & Fresh Herbs", value: "salt", description: "Brisk, clean, airy, energetic." },
                { text: "Red Rose & Honeyed Rum", value: "rose", description: "Rich, sweet, dark, seductive." }
            ]
        }
    ];

    const handleSelectOption = (qId: number, value: string) => {
        setAnswers(prev => ({ ...prev, [qId]: value }));
        if (step < questions.length) {
            setStep(step + 1);
        }
    };

    const handleBack = () => {
        if (step > 0) {
            setStep(step - 1);
        }
    };

    const calculateResult = () => {
        if (products.length === 0) return;

        const atmosphere = answers[1]; // Fresh, Woody, Floral
        const occasion = answers[2]; // day, night, all
        const note = answers[3]; // oud, salt, rose

        let scoreMap = products.map(product => {
            let score = 0;
            // Match category/theme
            if (product.category.toLowerCase().includes(atmosphere.toLowerCase())) {
                score += 3;
            }
            
            // Match note preferences
            if (note === 'oud' && (product.topNotes.toLowerCase().includes('oud') || product.heartNotes.toLowerCase().includes('oud') || product.baseNotes.toLowerCase().includes('oud') || product.baseNotes.toLowerCase().includes('agarwood') || product.baseNotes.toLowerCase().includes('leather'))) {
                score += 4;
            }
            if (note === 'salt' && (product.topNotes.toLowerCase().includes('salt') || product.heartNotes.toLowerCase().includes('sea') || product.topNotes.toLowerCase().includes('citrus') || product.topNotes.toLowerCase().includes('lemon'))) {
                score += 4;
            }
            if (note === 'rose' && (product.topNotes.toLowerCase().includes('rose') || product.heartNotes.toLowerCase().includes('orchid') || product.baseNotes.toLowerCase().includes('vanilla') || product.baseNotes.toLowerCase().includes('honey'))) {
                score += 4;
            }

            // Match occasion logic
            if (occasion === 'night' && (product.name.toLowerCase().includes('midnight') || product.name.toLowerCase().includes('royal') || product.name.toLowerCase().includes('velvet'))) {
                score += 2;
            }
            if (occasion === 'day' && (product.name.toLowerCase().includes('ocean') || product.name.toLowerCase().includes('citrus') || product.name.toLowerCase().includes('breeze'))) {
                score += 2;
            }

            return { product, score };
        });

        // Sort descending by score
        scoreMap.sort((a, b) => b.score - a.score);
        setRecommended(scoreMap[0]?.product || products[0]);
        setStep(4);
    };

    useEffect(() => {
        if (step === 4) {
            calculateResult();
        }
    }, [step]);

    const resetQuiz = () => {
        setAnswers({});
        setRecommended(null);
        setStep(0);
    };

    return (
        <div className={styles.main}>
            <Navbar />
            <div className={styles.container}>
                <div className={styles.quizBox}>
                    {step === 0 && (
                        <div className={styles.introCard}>
                            <span className={styles.tag}>SCENT PROFILE</span>
                            <h1 className={styles.title}>Find Your Olfactory Signature</h1>
                            <p className={styles.subtitle}>
                                Answer three questions crafted by our master perfumers to unlock the exact fragrance that defines your authority.
                            </p>
                            <button onClick={() => setStep(1)} className="btn">Begin Experience</button>
                        </div>
                    )}

                    {step > 0 && step <= questions.length && (
                        <div className={styles.questionCard}>
                            <div className={styles.progress}>
                                <span>Question {step} of {questions.length}</span>
                                <div className={styles.progressBar}>
                                    <div className={styles.progressFill} style={{ width: `${(step / questions.length) * 100}%` }} />
                                </div>
                            </div>

                            <h2 className={styles.questionText}>{questions[step - 1].text}</h2>

                            <div className={styles.optionsGrid}>
                                {questions[step - 1].options.map((opt, idx) => (
                                    <button 
                                        key={idx} 
                                        onClick={() => handleSelectOption(questions[step - 1].id, opt.value)}
                                        className={styles.optionCard}
                                    >
                                        <span className={styles.optionTitle}>{opt.text}</span>
                                        <span className={styles.optionDesc}>{opt.description}</span>
                                    </button>
                                ))}
                            </div>

                            <div className={styles.navRow}>
                                <button onClick={handleBack} className={styles.backBtn}>Back</button>
                            </div>
                        </div>
                    )}

                    {step === 4 && (
                        <div className={styles.resultCard}>
                            {recommended ? (
                                <div className={styles.resultGrid}>
                                    <div className={styles.resultImageContainer}>
                                        <img src={recommended.image} alt={recommended.name} className={styles.resultImage} />
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <span className={styles.tag}>YOUR IDEAL MATCH</span>
                                        <h2 className={styles.recName}>{recommended.name}</h2>
                                        <p className={styles.recDesc}>{recommended.description}</p>
                                        
                                        <div className={styles.notesBox}>
                                            <h4>OLFRACTIVE SPECTRUM</h4>
                                            <div className={styles.notes}>
                                                <div><span>TOP:</span> {recommended.topNotes || "Bergamot"}</div>
                                                <div><span>HEART:</span> {recommended.heartNotes || "Jasmine"}</div>
                                                <div><span>BASE:</span> {recommended.baseNotes || "Amber, Wood"}</div>
                                            </div>
                                        </div>

                                        <div className={styles.actions}>
                                            <button 
                                                onClick={() => {
                                                    addToCart({ ...recommended, price: Number(recommended.price) });
                                                    window.location.href = '/checkout';
                                                }}
                                                className="btn"
                                            >
                                                Acquire Scent - ${Number(recommended.price).toFixed(2)}
                                            </button>
                                            <button onClick={resetQuiz} className={styles.resetBtn}>Retake Quiz</button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <p>Finding your olfactory match...</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}
