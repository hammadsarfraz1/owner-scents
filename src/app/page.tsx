import { prisma } from '@/lib/prisma';
import HomeClient from './HomeClient';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function Home() {
    const [config, products] = await Promise.all([
        prisma.homepageConfig.findFirst(),
        prisma.product.findMany()
    ]);

    // Fallback config if database is empty
    const defaultConfig = config || {
        heroTitle: "ESSENCE OF AUTHORITY",
        heroSubtitle: "Curating timeless fragrance collections for the distinguished individual.",
        heroButtonText: "Shop Collection",
        heroScentFinderButtonText: "Find Your Scent",
        exploreTitle: "Explore Collections",
        exploreSubtitle: "Discover our highly acclaimed and newly arrived fragrances.",
        saleTitle: "Limited-Time Sale",
        saleSubtitle: "Exceptional values on our most coveted fragrances. Available for a limited duration.",
        showMarquee: true,
        marqueeText: "LUXURY • TIMELESS • ELEGANCE • BOLDNESS • ",
        split1Link: "/shop?gender=Men",
        split2Link: "/shop?gender=Women",
        testimonialsTitle: "Olfactory Appraisals",
        testimonialsSubtitle: "What the connoisseurs say about Owner Scents.",
        showTestimonials: true,
        whatsappNumber: "923001234567"
    };

    return <HomeClient initialConfig={defaultConfig} initialProducts={products} />;
}
