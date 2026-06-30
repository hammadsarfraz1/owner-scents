'use client';

import { useEffect, useState } from 'react';
import Footer from '@/components/Footer';
import { Mail, MessageCircle, Clock } from 'lucide-react';

type InfoPage = {
    title: string;
    content: string;
    isVisible: boolean;
};

export default function ContactPage() {
    const [pageData, setPageData] = useState<InfoPage | null>(null);
    const [config, setConfig] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [message, setMessage] = useState('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        Promise.all([
            fetch('/api/footer-pages?t=' + Date.now()).then(res => res.json()),
            fetch('/api/homepage-config?t=' + Date.now()).then(res => res.json())
        ])
        .then(([pages, homepageConfig]) => {
            const contactPage = Array.isArray(pages) ? pages.find((p: any) => p.slug === 'contact') : null;
            
            if (contactPage) {
                setPageData({
                    title: contactPage.title,
                    content: contactPage.content,
                    isVisible: true
                });
            } else {
                setPageData(null);
            }
            setConfig(homepageConfig);
            setLoading(false);
        })
        .catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    const whatsappNumber = config ? config.whatsappNumber : "923001234567";
    const supportEmail = "support@ownerscents.com";

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        // Simulate message sending
        setTimeout(() => {
            setFormSubmitted(true);
            setSubmitting(false);
            setName('');
            setPhone('');
            setMessage('');
        }, 1200);
    };

    if (loading) {
        return (
            <div style={{ background: '#050506', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#ffffff' }}>
                <p>Loading Concierge...</p>
            </div>
        );
    }

    // If page is hidden (not visible), render 404
    if (pageData && !pageData.isVisible) {
        return (
            <div style={{ background: '#050506', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
                <main style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '6rem 2rem' }}>
                    <div style={{ textAlign: 'center' }}>
                        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '3rem', marginBottom: '1rem' }}>404</h1>
                        <p style={{ color: 'var(--text-secondary)' }}>Page Not Found</p>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    // Parse top header lines
    const lines = pageData?.content ? pageData.content.split('\n') : [];
    const label = lines[0] || 'THE HAUTE PARFUMERIE';
    const headline = lines[1] || 'CONTACT CONCIERGE';
    const subtext = lines.slice(2).join('\n') || 'We are here to assist you with anything — orders, fragrance recommendations, delivery queries, or anything else.';

    return (
        <div style={{ background: '#050506', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
            
            <main style={{ flex: 1, padding: '8rem 2rem 6rem', position: 'relative', overflow: 'hidden' }}>
                {/* Background Glows */}
                <div style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.04) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <div className="container" style={{ maxWidth: '900px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    
                    {/* Top Header */}
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <span style={{ 
                            fontSize: '0.75rem', 
                            textTransform: 'uppercase', 
                            letterSpacing: '3px', 
                            color: 'var(--accent, #a855f7)', 
                            display: 'block', 
                            marginBottom: '1rem',
                            fontWeight: 600
                        }}>
                            {label}
                        </span>
                        <h1 style={{ 
                            fontFamily: 'var(--font-serif, serif)', 
                            fontSize: '3rem', 
                            letterSpacing: '1px', 
                            marginBottom: '1.5rem',
                            textTransform: 'uppercase'
                        }}>
                            {headline}
                        </h1>
                        <p style={{ 
                            color: 'rgba(255, 255, 255, 0.7)', 
                            fontSize: '1rem', 
                            lineHeight: '1.6', 
                            maxWidth: '650px',
                            margin: '0 auto',
                            fontWeight: 300
                        }}>
                            {subtext}
                        </p>
                    </div>

                    {/* 3 Info Cards */}
                    <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', 
                        gap: '2rem', 
                        marginBottom: '4rem' 
                    }}>
                        {/* WhatsApp Card */}
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.02)', 
                            border: '1px solid rgba(255, 255, 255, 0.05)', 
                            borderRadius: '16px', 
                            padding: '2.5rem 2rem', 
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem',
                            transition: 'border-color 0.3s ease'
                        }}>
                            <div style={{ color: '#25D366', background: 'rgba(37, 211, 102, 0.08)', padding: '1rem', borderRadius: '50%' }}>
                                <MessageCircle size={28} />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '1.5px', fontSize: '1.1rem' }}>WHATSAPP</h3>
                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', fontWeight: 300, margin: 0 }}>
                                Available 24 hours, 7 days a week.
                            </p>
                            <a 
                                href={`https://wa.me/${whatsappNumber}`} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                style={{ 
                                    marginTop: 'auto', 
                                    background: 'var(--accent, #a855f7)', 
                                    color: '#000', 
                                    padding: '0.75rem 1.5rem', 
                                    borderRadius: '8px', 
                                    fontSize: '0.85rem', 
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    transition: 'all 0.3s ease',
                                    boxShadow: '0 4px 15px rgba(168, 85, 247, 0.25)'
                                }}
                            >
                                Chat on WhatsApp
                            </a>
                        </div>

                        {/* Email Card */}
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.02)', 
                            border: '1px solid rgba(255, 255, 255, 0.05)', 
                            borderRadius: '16px', 
                            padding: '2.5rem 2rem', 
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{ color: 'var(--accent, #a855f7)', background: 'rgba(168, 85, 247, 0.08)', padding: '1rem', borderRadius: '50%' }}>
                                <Mail size={28} />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '1.5px', fontSize: '1.1rem' }}>EMAIL</h3>
                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', fontWeight: 300, margin: 0 }}>
                                For detailed queries and order concerns.
                            </p>
                            <a 
                                href={`mailto:${supportEmail}`}
                                style={{ 
                                    marginTop: 'auto',
                                    color: '#ffffff', 
                                    fontSize: '0.9rem', 
                                    fontWeight: 500,
                                    textDecoration: 'underline',
                                    opacity: 0.8
                                }}
                            >
                                {supportEmail}
                            </a>
                        </div>

                        {/* Response Time Card */}
                        <div style={{ 
                            background: 'rgba(255, 255, 255, 0.02)', 
                            border: '1px solid rgba(255, 255, 255, 0.05)', 
                            borderRadius: '16px', 
                            padding: '2.5rem 2rem', 
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{ color: 'var(--accent, #a855f7)', background: 'rgba(168, 85, 247, 0.08)', padding: '1rem', borderRadius: '50%' }}>
                                <Clock size={28} />
                            </div>
                            <h3 style={{ fontFamily: 'var(--font-serif)', letterSpacing: '1.5px', fontSize: '1.1rem' }}>RESPONSE TIME</h3>
                            <p style={{ color: 'rgba(255, 255, 255, 0.6)', fontSize: '0.9rem', fontWeight: 300, margin: 0 }}>
                                WhatsApp — Instant, 24/7.
                            </p>
                            <div style={{ marginTop: 'auto', fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.5)' }}>
                                Business Queries: 12-24h
                            </div>
                        </div>
                    </div>

                    {/* Business Hours Banner */}
                    <div style={{ 
                        background: 'linear-gradient(90deg, rgba(168, 85, 247, 0.04) 0%, rgba(5, 5, 6, 0) 100%)', 
                        borderLeft: '3px solid var(--accent, #a855f7)',
                        padding: '1.5rem 2rem', 
                        borderRadius: '0 8px 8px 0',
                        marginBottom: '4rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.25rem'
                    }}>
                        <h4 style={{ margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1.5px', color: 'var(--accent, #a855f7)' }}>BUSINESS HOURS</h4>
                        <span style={{ fontSize: '1.1rem', fontWeight: 300 }}>Available 24 hours, 7 days a week</span>
                    </div>

                    {/* Contact Message Form */}
                    <div style={{ 
                        background: 'rgba(255, 255, 255, 0.02)', 
                        border: '1px solid rgba(255, 255, 255, 0.05)', 
                        borderRadius: '16px', 
                        padding: '3rem 2.5rem'
                    }}>
                        <h3 style={{ fontFamily: 'var(--font-serif)', fontSize: '1.6rem', marginBottom: '2rem', letterSpacing: '0.5px' }}>SEND A MESSAGE</h3>
                        
                        {formSubmitted ? (
                            <div style={{ 
                                background: 'rgba(37, 211, 102, 0.05)', 
                                border: '1px solid #25d366', 
                                color: '#25d366', 
                                padding: '1.5rem', 
                                borderRadius: '8px', 
                                textAlign: 'center' 
                            }}>
                                <h4 style={{ margin: '0 0 0.5rem 0' }}>Thank You!</h4>
                                <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.9 }}>Your message has been sent successfully. We will get back to you shortly.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.6)' }}>Name *</label>
                                        <input 
                                            type="text" 
                                            value={name}
                                            onChange={e => setName(e.target.value)}
                                            style={{ 
                                                background: '#050506', 
                                                border: '1px solid rgba(255, 255, 255, 0.1)', 
                                                padding: '0.75rem 1rem', 
                                                borderRadius: '8px', 
                                                color: '#ffffff',
                                                outline: 'none',
                                                fontSize: '0.9rem'
                                            }}
                                            required
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                        <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.6)' }}>Phone Number *</label>
                                        <input 
                                            type="tel" 
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            style={{ 
                                                background: '#050506', 
                                                border: '1px solid rgba(255, 255, 255, 0.1)', 
                                                padding: '0.75rem 1rem', 
                                                borderRadius: '8px', 
                                                color: '#ffffff',
                                                outline: 'none',
                                                fontSize: '0.9rem'
                                            }}
                                            required
                                        />
                                    </div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                    <label style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'rgba(255, 255, 255, 0.6)' }}>Message *</label>
                                    <textarea 
                                        rows={5}
                                        value={message}
                                        onChange={e => setMessage(e.target.value)}
                                        style={{ 
                                            background: '#050506', 
                                            border: '1px solid rgba(255, 255, 255, 0.1)', 
                                            padding: '0.75rem 1rem', 
                                            borderRadius: '8px', 
                                            color: '#ffffff',
                                            outline: 'none',
                                            fontSize: '0.9rem',
                                            resize: 'none'
                                        }}
                                        required
                                    />
                                </div>
                                <button 
                                    type="submit" 
                                    style={{ 
                                        background: 'var(--accent, #a855f7)', 
                                        color: '#000000', 
                                        border: 'none', 
                                        padding: '1rem', 
                                        borderRadius: '8px', 
                                        fontSize: '0.95rem', 
                                        fontWeight: 600, 
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        boxShadow: '0 4px 15px rgba(168, 85, 247, 0.3)'
                                    }}
                                    disabled={submitting}
                                >
                                    {submitting ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
