'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import styles from './page.module.css';
import { useCart } from '@/context/CartContext';
import { Sparkles, ArrowRight, RotateCcw, ShoppingBag } from 'lucide-react';

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

const defaultQuestions: Question[] = [
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

export default function ScentFinder() {
    const [step, setStep] = useState(0); // 0: Intro, 1-3: Questions, 4: Analyzing, 5: Result
    const [answers, setAnswers] = useState<Record<number, string>>({});
    const [products, setProducts] = useState<Product[]>([]);
    const [questions, setQuestions] = useState<Question[]>(defaultQuestions);
    const [recommended, setRecommended] = useState<Product | null>(null);
    const [analyzingText, setAnalyzingText] = useState('Analyzing olfactory preferences...');
    const { addToCart } = useCart();

    useEffect(() => {
        // Fetch products
        fetch('/api/products')
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(console.error);

        // Fetch dynamic quiz configuration
        fetch('/api/homepage-config')
            .then(res => res.json())
            .then(data => {
                if (data.scentFinderConfig) {
                    try {
                        const parsed = JSON.parse(data.scentFinderConfig);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            setQuestions(parsed);
                        }
                    } catch (e) {
                        console.error("Failed to parse scentFinderConfig", e);
                    }
                }
            })
            .catch(console.error);
    }, []);

    const handleSelectOption = (qId: number, value: string) => {
        const nextAnswers = { ...answers, [qId]: value };
        setAnswers(nextAnswers);

        if (step < questions.length) {
            setStep(step + 1);
        } else {
            // Trigger Luxury Loading Analysis State
            setStep(4);
            runAnalysis(nextAnswers);
        }
    };

    const runAnalysis = (finalAnswers: Record<number, string>) => {
        setAnalyzingText('Extracting note accords...');
        setTimeout(() => {
            setAnalyzingText('Matching signature longevity spectrum...');
        }, 600);

        setTimeout(() => {
            calculateResult(finalAnswers);
            setStep(5);
        }, 1300);
    };

    const handleBack = () => {
        if (step > 0 && step <= questions.length) {
            setStep(step - 1);
        }
    };

    const calculateResult = (currentAnswers: Record<number, string>) => {
        if (!products || products.length === 0) return;

        const atmosphere = currentAnswers[1] || 'Fresh';
        const occasion = currentAnswers[2] || 'day';
        const note = currentAnswers[3] || 'oud';

        const scoreMap = products.map(product => {
            let score = 0;
            const cat = (product.category || '').toLowerCase();
            const top = (product.topNotes || '').toLowerCase();
            const heart = (product.heartNotes || '').toLowerCase();
            const base = (product.baseNotes || '').toLowerCase();
            const name = (product.name || '').toLowerCase();

            // 1. Match Category Atmosphere
            if (cat.includes(atmosphere.toLowerCase())) {
                score += 4;
            }
            
            // 2. Match Note Preference
            if (note === 'oud' && (top.includes('oud') || heart.includes('oud') || base.includes('oud') || base.includes('leather') || base.includes('wood') || base.includes('amber'))) {
                score += 5;
            }
            if (note === 'salt' && (top.includes('citrus') || top.includes('lemon') || heart.includes('sea') || top.includes('fresh') || top.includes('bergamot'))) {
                score += 5;
            }
            if (note === 'rose' && (top.includes('rose') || heart.includes('orchid') || base.includes('vanilla') || heart.includes('floral'))) {
                score += 5;
            }

            // 3. Match Occasion / Vibe
            if (occasion === 'night' && (name.includes('midnight') || name.includes('royal') || name.includes('velvet') || name.includes('oud'))) {
                score += 3;
            }
            if (occasion === 'day' && (name.includes('rose') || name.includes('elixir') || name.includes('fresh') || name.includes('clean'))) {
                score += 3;
            }

            return { product, score };
        });

        scoreMap.sort((a, b) => b.score - a.score);
        setRecommended(scoreMap[0]?.product || products[0]);
    };

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

                    {/* Step 0: Intro */}
                    {step === 0 && (
                        <div className={styles.introCard}>
                            <span className={styles.tag}>SCENT PROFILE CONSULTATION</span>
                            <h1 className={styles.title}>Find Your Olfactory Signature</h1>
                            <p className={styles.subtitle}>
                                Answer three bespoke questions crafted by our master perfumers to unlock the exact fragrance profile that commands your presence.
                            </p>
                            <button onClick={() => setStep(1)} className="btn sheenEffect" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', padding: '1rem 2.5rem' }}>
                                <span>Begin Consultation</span>
                                <ArrowRight size={18} />
                            </button>
                        </div>
                    )}

                    {/* Step 1 to N: Interactive Questions */}
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
                                <button onClick={handleBack} className={styles.backBtn}>← Back</button>
                            </div>
                        </div>
                    )}

                    {/* Step 4: Luxury Loading Analysis */}
                    {step === 4 && (
                        <div style={{ padding: '4rem 2rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ width: '60px', height: '60px', borderRadius: '50%', border: '2px solid var(--accent)', borderTopColor: 'transparent', animation: 'spin 1s linear infinite' }} />
                            <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', letterSpacing: '1px' }}>{analyzingText}</h3>
                            <style jsx>{`
                                @keyframes spin {
                                    0% { transform: rotate(0deg); }
                                    100% { transform: rotate(360deg); }
                                }
                            `}</style>
                        </div>
                    )}

                    {/* Step 5: Masterpiece Result Reveal */}
                    {step === 5 && (
                        <div className={styles.resultCard}>
                            {recommended ? (
                                <div className={styles.resultGrid}>
                                    <div className={styles.resultImageContainer}>
                                        <img src={recommended.image} alt={recommended.name} className={styles.resultImage} />
                                    </div>
                                    <div className={styles.resultDetails}>
                                        <span className={styles.tag} style={{ display: 'inline-block', background: 'var(--bg-tertiary)', padding: '0.4rem 0.8rem', borderRadius: '4px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
                                            YOUR IDEAL MATCH
                                        </span>
                                        <h2 className={styles.recName}>{recommended.name}</h2>
                                        <p className={styles.recDesc}>{recommended.description}</p>
                                        
                                        <div className={styles.notesBox}>
                                            <h4>OLFACTORY ACCORDS SPECTRUM</h4>
                                            <div className={styles.notes}>
                                                <div><span>TOP:</span> {recommended.topNotes || "Bergamot, Fresh Citrus"}</div>
                                                <div><span>HEART:</span> {recommended.heartNotes || "Rare Floral Heart"}</div>
                                                <div><span>BASE:</span> {recommended.baseNotes || "Warm Amber, Smoky Woods"}</div>
                                            </div>
                                        </div>

                                        <div className={styles.actions} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1.5rem' }}>
                                            <button 
                                                onClick={() => {
                                                    addToCart({ ...recommended, price: Number(recommended.price) });
                                                    window.location.href = '/checkout';
                                                }}
                                                className="btn sheenEffect"
                                                style={{ padding: '1rem 2rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '0.95rem' }}
                                            >
                                                <ShoppingBag size={18} />
                                                <span>Acquire Signature - Rs. {Number(recommended.price).toLocaleString()}</span>
                                            </button>

                                            <div style={{ display: 'flex', gap: '1rem', width: '100%' }}>
                                                <Link 
                                                    href={`/shop/${recommended.id}`} 
                                                    className={styles.resetBtn} 
                                                    style={{ flex: 1, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}
                                                >
                                                    View Details
                                                </Link>
                                                <button 
                                                    onClick={resetQuiz} 
                                                    className={styles.resetBtn}
                                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                                                >
                                                    <RotateCcw size={14} /> Retake Consultation
                                                </button>
                                            </div>
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
