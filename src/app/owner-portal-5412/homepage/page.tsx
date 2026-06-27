'use client';

import { useEffect, useState } from 'react';
import styles from '../admin.module.css';

type HomepageConfig = {
    card1Name: string;
    card1Edition: string;
    card1Image: string;
    card1Link: string;
    card2Name: string;
    card2Edition: string;
    card2Image: string;
    card2Link: string;
    card3Name: string;
    card3Edition: string;
    card3Image: string;
    card3Link: string;
    split1Title: string;
    split1Image: string;
    split1Link: string;
    split2Title: string;
    split2Image: string;
    split2Link: string;
    shippingPrice: string | number;
    freeShippingThreshold: string | number;
    promoText: string;
    showPromo: boolean;
    whatsappNumber: string;
    showWhatsapp: boolean;
    heroTitle: string;
    heroSubtitle: string;
    heroButtonText: string;
    heroScentFinderButtonText: string;
    showHero: boolean;
    marqueeText: string;
    showMarquee: boolean;
    saleLabel: string;
    saleTitle: string;
    saleSubtitle: string;
    showSale: boolean;
    exploreTitle: string;
    exploreSubtitle: string;
    showExplore: boolean;
    signatureTitle: string;
    signatureSubtitle: string;
    signatureButtonText: string;
    showSignature: boolean;
    storyLabel: string;
    storyTitle: string;
    storyDescription: string;
    storyButtonText: string;
    showStory: boolean;
    testimonialsTitle: string;
    testimonialsSubtitle: string;
    showTestimonials: boolean;
};

export default function EditHomepage() {
    const [config, setConfig] = useState<HomepageConfig | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // State fields for the form
    const [card1Name, setCard1Name] = useState('');
    const [card1Edition, setCard1Edition] = useState('');
    const [card1Image, setCard1Image] = useState('');
    const [card1Link, setCard1Link] = useState('');

    const [card2Name, setCard2Name] = useState('');
    const [card2Edition, setCard2Edition] = useState('');
    const [card2Image, setCard2Image] = useState('');
    const [card2Link, setCard2Link] = useState('');

    const [card3Name, setCard3Name] = useState('');
    const [card3Edition, setCard3Edition] = useState('');
    const [card3Image, setCard3Image] = useState('');
    const [card3Link, setCard3Link] = useState('');

    const [split1Title, setSplit1Title] = useState('');
    const [split1Image, setSplit1Image] = useState('');
    const [split1Link, setSplit1Link] = useState('');

    const [split2Title, setSplit2Title] = useState('');
    const [split2Image, setSplit2Image] = useState('');
    const [split2Link, setSplit2Link] = useState('');

    const [shippingPrice, setShippingPrice] = useState('');
    const [freeShippingThreshold, setFreeShippingThreshold] = useState('');
    const [promoText, setPromoText] = useState('');
    const [showPromo, setShowPromo] = useState(true);
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [showWhatsapp, setShowWhatsapp] = useState(true);

    const [heroTitle, setHeroTitle] = useState('');
    const [heroSubtitle, setHeroSubtitle] = useState('');
    const [heroButtonText, setHeroButtonText] = useState('');
    const [heroScentFinderButtonText, setHeroScentFinderButtonText] = useState('');
    const [showHero, setShowHero] = useState(true);

    const [marqueeText, setMarqueeText] = useState('');
    const [showMarquee, setShowMarquee] = useState(true);

    const [saleLabel, setSaleLabel] = useState('');
    const [saleTitle, setSaleTitle] = useState('');
    const [saleSubtitle, setSaleSubtitle] = useState('');
    const [showSale, setShowSale] = useState(true);

    const [exploreTitle, setExploreTitle] = useState('');
    const [exploreSubtitle, setExploreSubtitle] = useState('');
    const [showExplore, setShowExplore] = useState(true);

    const [signatureTitle, setSignatureTitle] = useState('');
    const [signatureSubtitle, setSignatureSubtitle] = useState('');
    const [signatureButtonText, setSignatureButtonText] = useState('');
    const [showSignature, setShowSignature] = useState(true);

    const [storyLabel, setStoryLabel] = useState('');
    const [storyTitle, setStoryTitle] = useState('');
    const [storyDescription, setStoryDescription] = useState('');
    const [storyButtonText, setStoryButtonText] = useState('');
    const [showStory, setShowStory] = useState(true);

    const [testimonialsTitle, setTestimonialsTitle] = useState('');
    const [testimonialsSubtitle, setTestimonialsSubtitle] = useState('');
    const [showTestimonials, setShowTestimonials] = useState(true);

    const fetchConfig = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/homepage-config');
            if (res.ok) {
                const data = await res.json();
                setConfig(data);
                
                // Initialize states
                setCard1Name(data.card1Name);
                setCard1Edition(data.card1Edition);
                setCard1Image(data.card1Image);
                setCard1Link(data.card1Link);

                setCard2Name(data.card2Name);
                setCard2Edition(data.card2Edition);
                setCard2Image(data.card2Image);
                setCard2Link(data.card2Link);

                setCard3Name(data.card3Name);
                setCard3Edition(data.card3Edition);
                setCard3Image(data.card3Image);
                setCard3Link(data.card3Link);

                setSplit1Title(data.split1Title);
                setSplit1Image(data.split1Image);
                setSplit1Link(data.split1Link);

                setSplit2Title(data.split2Title);
                setSplit2Image(data.split2Image);
                setSplit2Link(data.split2Link);

                setShippingPrice(data.shippingPrice !== undefined ? Number(data.shippingPrice).toString() : '250');
                setFreeShippingThreshold(data.freeShippingThreshold !== undefined ? Number(data.freeShippingThreshold).toString() : '3000');
                setPromoText(data.promoText || 'Enjoy Free Shipping on Orders Above Rs. 3,000');
                setShowPromo(data.showPromo !== undefined ? Boolean(data.showPromo) : true);
                setWhatsappNumber(data.whatsappNumber || '923001234567');
                setShowWhatsapp(data.showWhatsapp !== undefined ? Boolean(data.showWhatsapp) : true);

                setHeroTitle(data.heroTitle || 'ESSENCE OF AUTHORITY');
                setHeroSubtitle(data.heroSubtitle || 'Curating timeless fragrance collections for the distinguished individual.');
                setHeroButtonText(data.heroButtonText || 'Shop Collection');
                setHeroScentFinderButtonText(data.heroScentFinderButtonText || 'Find Your Scent');
                setShowHero(data.showHero !== undefined ? Boolean(data.showHero) : true);

                setMarqueeText(data.marqueeText || 'LUXURY • TIMELESS • ELEGANCE • BOLDNESS • ');
                setShowMarquee(data.showMarquee !== undefined ? Boolean(data.showMarquee) : true);

                setSaleLabel(data.saleLabel || 'EXCLUSIVE OFFER');
                setSaleTitle(data.saleTitle || 'Limited-Time Sale');
                setSaleSubtitle(data.saleSubtitle || 'Exceptional values on our most coveted fragrances. Available for a limited duration.');
                setShowSale(data.showSale !== undefined ? Boolean(data.showSale) : true);

                setExploreTitle(data.exploreTitle || 'Explore Collections');
                setExploreSubtitle(data.exploreSubtitle || 'Discover our highly acclaimed and newly arrived fragrances.');
                setShowExplore(data.showExplore !== undefined ? Boolean(data.showExplore) : true);

                setSignatureTitle(data.signatureTitle || 'Signature Scents');
                setSignatureSubtitle(data.signatureSubtitle || 'Hand-crafted fragrances curated for modern authority.');
                setSignatureButtonText(data.signatureButtonText || 'Explore Full Catalog');
                setShowSignature(data.showSignature !== undefined ? Boolean(data.showSignature) : true);

                setStoryLabel(data.storyLabel || 'OUR LEGACY');
                setStoryTitle(data.storyTitle || 'The Owner\'s Story');
                setStoryDescription(data.storyDescription || 'Crafted for those who walk into a room and own it without saying a word. Our fragrances are designed to make an indelible mark, using rarest natural extracts sourced from around the globe.');
                setStoryButtonText(data.storyButtonText || 'Read Our Philosophy');
                setShowStory(data.showStory !== undefined ? Boolean(data.showStory) : true);

                setTestimonialsTitle(data.testimonialsTitle || 'Client Appraisals');
                setTestimonialsSubtitle(data.testimonialsSubtitle || 'What the connoisseurs say about Owner Scents.');
                setShowTestimonials(data.showTestimonials !== undefined ? Boolean(data.showTestimonials) : true);
            } else {
                throw new Error('Failed to load configuration');
            }
        } catch (err) {
            console.error(err);
            setError('Failed to load homepage configuration.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchConfig();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError('');
        setSuccess('');

        const payload = {
            card1Name, card1Edition, card1Image, card1Link,
            card2Name, card2Edition, card2Image, card2Link,
            card3Name, card3Edition, card3Image, card3Link,
            split1Title, split1Image, split1Link,
            split2Title, split2Image, split2Link,
            shippingPrice: Number(shippingPrice),
            freeShippingThreshold: Number(freeShippingThreshold),
            promoText,
            showPromo,
            whatsappNumber,
            showWhatsapp,
            heroTitle,
            heroSubtitle,
            heroButtonText,
            heroScentFinderButtonText,
            showHero,
            marqueeText,
            showMarquee,
            saleLabel,
            saleTitle,
            saleSubtitle,
            showSale,
            exploreTitle,
            exploreSubtitle,
            showExplore,
            signatureTitle,
            signatureSubtitle,
            signatureButtonText,
            showSignature,
            storyLabel,
            storyTitle,
            storyDescription,
            storyButtonText,
            showStory,
            testimonialsTitle,
            testimonialsSubtitle,
            showTestimonials,
        };

        try {
            const res = await fetch('/api/admin/homepage-config', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (res.ok) {
                setSuccess('Homepage configuration updated successfully!');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to save configuration.');
            }
        } catch (err) {
            console.error(err);
            setError('Network error, please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading Configuration...</div>;

    return (
        <div style={{ maxWidth: '1000px' }}>
            <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2.5rem', marginBottom: '2rem' }}>Edit Homepage</h1>

            {error && <div style={{ color: '#ef4444', background: '#ef44440d', padding: '1rem', border: '1px solid #ef4444', marginBottom: '1.5rem', borderRadius: '4px' }}>{error}</div>}
            {success && <div style={{ color: '#10b981', background: '#10b9810d', padding: '1rem', border: '1px solid #10b981', marginBottom: '1.5rem', borderRadius: '4px' }}>{success}</div>}

            <form onSubmit={handleSubmit}>
                
                {/* 3D Stack Cards Configuration */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        3D Card Stack (Showcase)
                    </h2>

                    {/* Card 1 (Left) */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Card 1 (Left Position)</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name *</label>
                                <input type="text" value={card1Name} onChange={(e) => setCard1Name(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Edition / Subtitle *</label>
                                <input type="text" value={card1Edition} onChange={(e) => setCard1Edition(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={card1Image} onChange={(e) => setCard1Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link / Page URL *</label>
                                <input type="text" value={card1Link} onChange={(e) => setCard1Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>

                    {/* Card 2 (Center) */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Card 2 (Center Focus Position)</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name *</label>
                                <input type="text" value={card2Name} onChange={(e) => setCard2Name(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Edition / Subtitle *</label>
                                <input type="text" value={card2Edition} onChange={(e) => setCard2Edition(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={card2Image} onChange={(e) => setCard2Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link / Page URL *</label>
                                <input type="text" value={card2Link} onChange={(e) => setCard2Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>

                    {/* Card 3 (Right) */}
                    <div style={{ paddingBottom: '0.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Card 3 (Right Position)</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Name *</label>
                                <input type="text" value={card3Name} onChange={(e) => setCard3Name(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Edition / Subtitle *</label>
                                <input type="text" value={card3Edition} onChange={(e) => setCard3Edition(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={card3Image} onChange={(e) => setCard3Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link / Page URL *</label>
                                <input type="text" value={card3Link} onChange={(e) => setCard3Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>

                </div>

                {/* Categories Splits Configuration */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        Categories splits (Him / Her)
                    </h2>

                    {/* Split 1 (Left - Him) */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Left split (For Him)</h4>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Title *</label>
                            <input type="text" value={split1Title} onChange={(e) => setSplit1Title(e.target.value)} className={styles.input} required />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={split1Image} onChange={(e) => setSplit1Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link *</label>
                                <input type="text" value={split1Link} onChange={(e) => setSplit1Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>

                    {/* Split 2 (Right - Her) */}
                    <div>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Right split (For Her)</h4>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Title *</label>
                            <input type="text" value={split2Title} onChange={(e) => setSplit2Title(e.target.value)} className={styles.input} required />
                        </div>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Image URL *</label>
                                <input type="text" value={split2Image} onChange={(e) => setSplit2Image(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Target Link *</label>
                                <input type="text" value={split2Link} onChange={(e) => setSplit2Link(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Hero & Marquee Customization */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        Hero & Marquee Customization
                    </h2>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                        <input type="checkbox" id="showHero" checked={showHero} onChange={(e) => setShowHero(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                        <label htmlFor="showHero" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>Show Hero section on storefront</label>
                    </div>

                    {showHero && (
                        <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Hero Main Title *</label>
                                <input type="text" value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Hero Subtitle / Description *</label>
                                <textarea value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} className={styles.textarea} rows={2} required />
                            </div>
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Shop Button Text *</label>
                                    <input type="text" value={heroButtonText} onChange={(e) => setHeroButtonText(e.target.value)} className={styles.input} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Scent Finder Button Text *</label>
                                    <input type="text" value={heroScentFinderButtonText} onChange={(e) => setHeroScentFinderButtonText(e.target.value)} className={styles.input} required />
                                </div>
                            </div>
                        </div>
                    )}

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                        <input type="checkbox" id="showMarquee" checked={showMarquee} onChange={(e) => setShowMarquee(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                        <label htmlFor="showMarquee" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '500' }}>Show Moving Marquee Stripe on storefront</label>
                    </div>

                    {showMarquee && (
                        <div className={styles.formGroup} style={{ marginTop: '1rem' }}>
                            <label className={styles.label}>Marquee Text (Ending with bullet/space, e.g. "LUXURY • TIMELESS • ") *</label>
                            <input type="text" value={marqueeText} onChange={(e) => setMarqueeText(e.target.value)} className={styles.input} required />
                        </div>
                    )}
                </div>

                {/* Homepage Sections Customize */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        Home Sections Customization
                    </h2>

                    {/* On Sale Section Settings */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input type="checkbox" id="showSale" checked={showSale} onChange={(e) => setShowSale(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            <label htmlFor="showSale" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>SHOW LIMITED-TIME SALE SECTION</label>
                        </div>
                        {showSale && (
                            <>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Section Small Label *</label>
                                        <input type="text" value={saleLabel} onChange={(e) => setSaleLabel(e.target.value)} className={styles.input} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Section Title *</label>
                                        <input type="text" value={saleTitle} onChange={(e) => setSaleTitle(e.target.value)} className={styles.input} required />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Section Subtitle / Description *</label>
                                    <input type="text" value={saleSubtitle} onChange={(e) => setSaleSubtitle(e.target.value)} className={styles.input} required />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Explore Collections Settings */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input type="checkbox" id="showExplore" checked={showExplore} onChange={(e) => setShowExplore(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            <label htmlFor="showExplore" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>SHOW EXPLORE COLLECTIONS SECTION</label>
                        </div>
                        {showExplore && (
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Section Title *</label>
                                    <input type="text" value={exploreTitle} onChange={(e) => setExploreTitle(e.target.value)} className={styles.input} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Section Subtitle *</label>
                                    <input type="text" value={exploreSubtitle} onChange={(e) => setExploreSubtitle(e.target.value)} className={styles.input} required />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Signature Scents Settings */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input type="checkbox" id="showSignature" checked={showSignature} onChange={(e) => setShowSignature(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            <label htmlFor="showSignature" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>SHOW SIGNATURE SCENTS SECTION</label>
                        </div>
                        {showSignature && (
                            <>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Section Title *</label>
                                        <input type="text" value={signatureTitle} onChange={(e) => setSignatureTitle(e.target.value)} className={styles.input} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Button Text *</label>
                                        <input type="text" value={signatureButtonText} onChange={(e) => setSignatureButtonText(e.target.value)} className={styles.input} required />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Section Subtitle *</label>
                                    <input type="text" value={signatureSubtitle} onChange={(e) => setSignatureSubtitle(e.target.value)} className={styles.input} required />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Owner's Story Settings */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input type="checkbox" id="showStory" checked={showStory} onChange={(e) => setShowStory(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            <label htmlFor="showStory" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>SHOW OWNER'S STORY SECTION</label>
                        </div>
                        {showStory && (
                            <>
                                <div className={styles.formRow}>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Story Label *</label>
                                        <input type="text" value={storyLabel} onChange={(e) => setStoryLabel(e.target.value)} className={styles.input} required />
                                    </div>
                                    <div className={styles.formGroup}>
                                        <label className={styles.label}>Story Title *</label>
                                        <input type="text" value={storyTitle} onChange={(e) => setStoryTitle(e.target.value)} className={styles.input} required />
                                    </div>
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Story Description Text *</label>
                                    <textarea value={storyDescription} onChange={(e) => setStoryDescription(e.target.value)} className={styles.textarea} rows={3} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>PHILOSOPHY Link Button Text *</label>
                                    <input type="text" value={storyButtonText} onChange={(e) => setStoryButtonText(e.target.value)} className={styles.input} required />
                                </div>
                            </>
                        )}
                    </div>

                    {/* Client Appraisals (Testimonials) Settings */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input type="checkbox" id="showTestimonials" checked={showTestimonials} onChange={(e) => setShowTestimonials(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            <label htmlFor="showTestimonials" style={{ cursor: 'pointer', fontSize: '0.9rem', fontWeight: '700' }}>SHOW CLIENT APPRAISALS SECTION</label>
                        </div>
                        {showTestimonials && (
                            <div className={styles.formRow}>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Section Title *</label>
                                    <input type="text" value={testimonialsTitle} onChange={(e) => setTestimonialsTitle(e.target.value)} className={styles.input} required />
                                </div>
                                <div className={styles.formGroup}>
                                    <label className={styles.label}>Section Subtitle *</label>
                                    <input type="text" value={testimonialsSubtitle} onChange={(e) => setTestimonialsSubtitle(e.target.value)} className={styles.input} required />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Global Store Settings */}
                <div style={{ background: 'var(--bg-secondary)', padding: '2rem', border: '1px solid var(--border-color)', borderRadius: '8px', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontFamily: 'var(--font-serif)', textTransform: 'uppercase', fontSize: '1.25rem', letterSpacing: '1px', marginBottom: '1.5rem', color: 'var(--accent)' }}>
                        Global Store Settings
                    </h2>

                    {/* Shipping Settings */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Shipping Configuration</h4>
                        <div className={styles.formRow}>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Shipping Price (PKR) *</label>
                                <input type="number" value={shippingPrice} onChange={(e) => setShippingPrice(e.target.value)} className={styles.input} required />
                            </div>
                            <div className={styles.formGroup}>
                                <label className={styles.label}>Free Shipping Threshold (PKR) *</label>
                                <input type="number" value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(e.target.value)} className={styles.input} required />
                            </div>
                        </div>
                    </div>

                    {/* Promo Bar Settings */}
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem', marginBottom: '1.5rem' }}>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>Promotional Bar</h4>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>Promo Banner Text *</label>
                            <input type="text" value={promoText} onChange={(e) => setPromoText(e.target.value)} className={styles.input} required />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                            <input type="checkbox" id="showPromo" checked={showPromo} onChange={(e) => setShowPromo(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            <label htmlFor="showPromo" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>Show Promo Bar on storefront</label>
                        </div>
                    </div>

                    {/* WhatsApp Widget Settings */}
                    <div>
                        <h4 style={{ textTransform: 'uppercase', fontSize: '0.85rem', letterSpacing: '1px', marginBottom: '1rem' }}>WhatsApp Concierge Widget</h4>
                        <div className={styles.formGroup}>
                            <label className={styles.label}>WhatsApp Number (Include Country Code, e.g. 923001234567) *</label>
                            <input type="text" value={whatsappNumber} onChange={(e) => setWhatsappNumber(e.target.value)} className={styles.input} required />
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
                            <input type="checkbox" id="showWhatsapp" checked={showWhatsapp} onChange={(e) => setShowWhatsapp(e.target.checked)} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                            <label htmlFor="showWhatsapp" style={{ cursor: 'pointer', fontSize: '0.9rem' }}>Show WhatsApp Floating Widget on storefront</label>
                        </div>
                    </div>
                </div>

                {/* Form Actions */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="submit" className={styles.btnPrimary} style={{ padding: '0.8rem 2rem' }} disabled={submitting}>
                        {submitting ? 'Saving Configurations...' : 'Save Configurations'}
                    </button>
                </div>
            </form>
        </div>
    );
}
