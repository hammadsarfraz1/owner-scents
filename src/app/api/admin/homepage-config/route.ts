import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        
        const config = await prisma.homepageConfig.upsert({
            where: { id: 'singleton' },
            update: {
                card1Name: body.card1Name,
                card1Edition: body.card1Edition,
                card1Image: body.card1Image,
                card1Link: body.card1Link,
                card2Name: body.card2Name,
                card2Edition: body.card2Edition,
                card2Image: body.card2Image,
                card2Link: body.card2Link,
                card3Name: body.card3Name,
                card3Edition: body.card3Edition,
                card3Image: body.card3Image,
                card3Link: body.card3Link,
                                split1Title: body.split1Title,
                split1Image: body.split1Image,
                split1Link: body.split1Link,
                split2Title: body.split2Title,
                split2Image: body.split2Image,
                split2Link: body.split2Link,
                shippingPrice: body.shippingPrice !== undefined ? Number(body.shippingPrice) : undefined,
                freeShippingThreshold: body.freeShippingThreshold !== undefined ? Number(body.freeShippingThreshold) : undefined,
                promoText: body.promoText !== undefined ? body.promoText : undefined,
                showPromo: body.showPromo !== undefined ? Boolean(body.showPromo) : undefined,
                whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : undefined,
                showWhatsapp: body.showWhatsapp !== undefined ? Boolean(body.showWhatsapp) : undefined,
                heroTitle: body.heroTitle !== undefined ? body.heroTitle : undefined,
                heroSubtitle: body.heroSubtitle !== undefined ? body.heroSubtitle : undefined,
                heroButtonText: body.heroButtonText !== undefined ? body.heroButtonText : undefined,
                heroScentFinderButtonText: body.heroScentFinderButtonText !== undefined ? body.heroScentFinderButtonText : undefined,
                showHero: body.showHero !== undefined ? Boolean(body.showHero) : undefined,
                marqueeText: body.marqueeText !== undefined ? body.marqueeText : undefined,
                showMarquee: body.showMarquee !== undefined ? Boolean(body.showMarquee) : undefined,
                saleLabel: body.saleLabel !== undefined ? body.saleLabel : undefined,
                saleTitle: body.saleTitle !== undefined ? body.saleTitle : undefined,
                saleSubtitle: body.saleSubtitle !== undefined ? body.saleSubtitle : undefined,
                showSale: body.showSale !== undefined ? Boolean(body.showSale) : undefined,
                exploreTitle: body.exploreTitle !== undefined ? body.exploreTitle : undefined,
                exploreSubtitle: body.exploreSubtitle !== undefined ? body.exploreSubtitle : undefined,
                showExplore: body.showExplore !== undefined ? Boolean(body.showExplore) : undefined,
                signatureTitle: body.signatureTitle !== undefined ? body.signatureTitle : undefined,
                signatureSubtitle: body.signatureSubtitle !== undefined ? body.signatureSubtitle : undefined,
                signatureButtonText: body.signatureButtonText !== undefined ? body.signatureButtonText : undefined,
                showSignature: body.showSignature !== undefined ? Boolean(body.showSignature) : undefined,
                storyLabel: body.storyLabel !== undefined ? body.storyLabel : undefined,
                storyTitle: body.storyTitle !== undefined ? body.storyTitle : undefined,
                storyDescription: body.storyDescription !== undefined ? body.storyDescription : undefined,
                storyButtonText: body.storyButtonText !== undefined ? body.storyButtonText : undefined,
                showStory: body.showStory !== undefined ? Boolean(body.showStory) : undefined,
                testimonialsTitle: body.testimonialsTitle !== undefined ? body.testimonialsTitle : undefined,
                testimonialsSubtitle: body.testimonialsSubtitle !== undefined ? body.testimonialsSubtitle : undefined,
                showTestimonials: body.showTestimonials !== undefined ? Boolean(body.showTestimonials) : undefined,
                scentFinderConfig: body.scentFinderConfig !== undefined ? body.scentFinderConfig : undefined,
            },
            create: {
                id: 'singleton',
                card1Name: body.card1Name,
                card1Edition: body.card1Edition,
                card1Image: body.card1Image,
                card1Link: body.card1Link,
                card2Name: body.card2Name,
                card2Edition: body.card2Edition,
                card2Image: body.card2Image,
                card2Link: body.card2Link,
                card3Name: body.card3Name,
                card3Edition: body.card3Edition,
                card3Image: body.card3Image,
                card3Link: body.card3Link,
                split1Title: body.split1Title,
                split1Image: body.split1Image,
                split1Link: body.split1Link,
                split2Title: body.split2Title,
                split2Image: body.split2Image,
                split2Link: body.split2Link,
                shippingPrice: body.shippingPrice !== undefined ? Number(body.shippingPrice) : 250,
                freeShippingThreshold: body.freeShippingThreshold !== undefined ? Number(body.freeShippingThreshold) : 3000,
                promoText: body.promoText !== undefined ? body.promoText : "Enjoy Free Shipping on Orders Above Rs. 3,000",
                showPromo: body.showPromo !== undefined ? Boolean(body.showPromo) : true,
                whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : "923001234567",
                showWhatsapp: body.showWhatsapp !== undefined ? Boolean(body.showWhatsapp) : true,
                heroTitle: body.heroTitle !== undefined ? body.heroTitle : "ESSENCE OF AUTHORITY",
                heroSubtitle: body.heroSubtitle !== undefined ? body.heroSubtitle : "Curating timeless fragrance collections for the distinguished individual.",
                heroButtonText: body.heroButtonText !== undefined ? body.heroButtonText : "Shop Collection",
                heroScentFinderButtonText: body.heroScentFinderButtonText !== undefined ? body.heroScentFinderButtonText : "Find Your Scent",
                showHero: body.showHero !== undefined ? Boolean(body.showHero) : true,
                marqueeText: body.marqueeText !== undefined ? body.marqueeText : "LUXURY • TIMELESS • ELEGANCE • BOLDNESS • ",
                showMarquee: body.showMarquee !== undefined ? Boolean(body.showMarquee) : true,
                saleLabel: body.saleLabel !== undefined ? body.saleLabel : "EXCLUSIVE OFFER",
                saleTitle: body.saleTitle !== undefined ? body.saleTitle : "Limited-Time Sale",
                saleSubtitle: body.saleSubtitle !== undefined ? body.saleSubtitle : "Exceptional values on our most coveted fragrances. Available for a limited duration.",
                showSale: body.showSale !== undefined ? Boolean(body.showSale) : true,
                exploreTitle: body.exploreTitle !== undefined ? body.exploreTitle : "Explore Collections",
                exploreSubtitle: body.exploreSubtitle !== undefined ? body.exploreSubtitle : "Discover our highly acclaimed and newly arrived fragrances.",
                showExplore: body.showExplore !== undefined ? Boolean(body.showExplore) : true,
                signatureTitle: body.signatureTitle !== undefined ? body.signatureTitle : "Signature Scents",
                signatureSubtitle: body.signatureSubtitle !== undefined ? body.signatureSubtitle : "Hand-crafted fragrances curated for modern authority.",
                signatureButtonText: body.signatureButtonText !== undefined ? body.signatureButtonText : "Explore Full Catalog",
                showSignature: body.showSignature !== undefined ? Boolean(body.showSignature) : true,
                storyLabel: body.storyLabel !== undefined ? body.storyLabel : "OUR LEGACY",
                storyTitle: body.storyTitle !== undefined ? body.storyTitle : "The Owner's Story",
                storyDescription: body.storyDescription !== undefined ? body.storyDescription : "Crafted for those who walk into a room and own it without saying a word. Our fragrances are designed to make an indelible mark, using rarest natural extracts sourced from around the globe.",
                storyButtonText: body.storyButtonText !== undefined ? body.storyButtonText : "Read Our Philosophy",
                showStory: body.showStory !== undefined ? Boolean(body.showStory) : true,
                testimonialsTitle: body.testimonialsTitle !== undefined ? body.testimonialsTitle : "Client Appraisals",
                testimonialsSubtitle: body.testimonialsSubtitle !== undefined ? body.testimonialsSubtitle : "What the connoisseurs say about Owner Scents.",
                showTestimonials: body.showTestimonials !== undefined ? Boolean(body.showTestimonials) : true,
                scentFinderConfig: body.scentFinderConfig !== undefined ? body.scentFinderConfig : "",
            }
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error('Admin PUT homepage config error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
