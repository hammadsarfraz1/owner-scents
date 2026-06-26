import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const DEFAULT_SCENT_DESCRIPTIONS: Record<string, string> = {
    "Bergamot": "Fresh, citrusy, and slightly spicy scent. Found in high-end top notes.",
    "Grapefruit": "Bright, zesty, and energizing citrus note.",
    "Jasmine": "Rich, warm, sweet floral note. Provides a luxurious heart.",
    "Sage": "Herbal, clean, and earthy notes for a masculine/unisex touch.",
    "Sandalwood": "Creamy, rich, exotic wood scent. A classic luxury base note.",
    "Oud": "Deep, smoky, woody, and prestigious oriental resin note.",
    "Rose": "Classic, romantic floral note with powdery and sweet facets.",
    "Amber": "Warm, sweet, resinous, and cozy base note.",
    "Vanilla": "Sweet, comforting, and warm balsamic note.",
    "Patchouli": "Earthy, sweet, and dark musky note with wood tones.",
    "Musk": "Sensual, clean, and animalic note that lingers on skin.",
    "Lavender": "Aromatic, clean, floral, and calming herb note.",
    "Cedarwood": "Dry, clean woody scent. Provides structure and longevity."
};

export async function GET() {
    try {
        let notes = await prisma.scentNote.findMany();

        // Auto-seed if empty
        if (notes.length === 0) {
            const seedData = Object.entries(DEFAULT_SCENT_DESCRIPTIONS).map(([name, description]) => ({
                name,
                description
            }));

            await prisma.scentNote.createMany({
                data: seedData,
                skipDuplicates: true
            });

            notes = await prisma.scentNote.findMany();
        }

        // Convert to key-value record
        const record: Record<string, string> = {};
        for (const note of notes) {
            record[note.name] = note.description;
        }

        return NextResponse.json(record);
    } catch (error) {
        console.error('GET scent-notes error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
