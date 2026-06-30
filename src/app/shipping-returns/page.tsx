import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import Footer from '@/components/Footer';
import Link from 'next/link';

export const revalidate = 0; // Disable caching so edits show up instantly

export default async function ShippingReturnsPage() {
    const page = await prisma.infoPage.findUnique({
        where: { slug: 'shipping-returns' }
    });

    if (!page || !page.isVisible) {
        notFound();
    }

    // Parse sections
    const sections = page.content.split('\n\n').map(section => {
        const lines = section.split('\n');
        const title = lines[0];
        const bodyLines = lines.slice(1);
        return { title, bodyLines };
    });

    return (
        <div style={{ background: '#050506', minHeight: '100vh', display: 'flex', flexDirection: 'column', color: '#ffffff' }}>
            
            <main style={{ flex: 1, padding: '8rem 2rem 6rem', position: 'relative', overflow: 'hidden' }}>
                {/* Subtle Background Glows */}
                <div style={{
                    position: 'absolute',
                    top: '20%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '600px',
                    height: '600px',
                    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.05) 0%, transparent 70%)',
                    pointerEvents: 'none',
                    zIndex: 0
                }} />

                <div className="container" style={{ maxWidth: '800px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
                    <span style={{ 
                        fontSize: '0.75rem', 
                        textTransform: 'uppercase', 
                        letterSpacing: '3px', 
                        color: 'var(--accent, #a855f7)', 
                        display: 'block', 
                        marginBottom: '1rem',
                        fontWeight: 600,
                        textAlign: 'center'
                    }}>
                        Owner Scents
                    </span>
                    
                    <h1 style={{ 
                        fontFamily: 'var(--font-serif, serif)', 
                        fontSize: '2.8rem', 
                        textAlign: 'center', 
                        letterSpacing: '1px', 
                        marginBottom: '3rem',
                        textTransform: 'uppercase'
                    }}>
                        {page.title}
                    </h1>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem', lineHeight: '1.7', color: 'rgba(255, 255, 255, 0.8)' }}>
                        {sections.map((sec, idx) => (
                            <div key={idx} style={{ 
                                background: 'rgba(255, 255, 255, 0.02)', 
                                border: '1px solid rgba(255, 255, 255, 0.05)', 
                                padding: '2rem', 
                                borderRadius: '12px' 
                            }}>
                                <h3 style={{ 
                                    color: '#ffffff', 
                                    fontFamily: 'var(--font-serif, serif)',
                                    fontSize: '1.2rem', 
                                    marginBottom: '1rem', 
                                    letterSpacing: '1px',
                                    borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                                    paddingBottom: '0.5rem',
                                    textTransform: 'uppercase'
                                }}>
                                    {sec.title}
                                </h3>
                                {sec.bodyLines.map((line, lIdx) => {
                                    if (line.trim().startsWith('-')) {
                                        return (
                                            <li key={lIdx} style={{ listStyleType: 'square', marginLeft: '1.5rem', marginBottom: '0.5rem', fontSize: '0.95rem' }}>
                                                {line.trim().substring(1).trim()}
                                            </li>
                                        );
                                    }
                                    return (
                                        <p key={lIdx} style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem', fontWeight: 300 }}>
                                            {line}
                                        </p>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
