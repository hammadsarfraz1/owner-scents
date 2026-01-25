const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    const products = [
        {
            name: 'Midnight Noir',
            description: 'A deep, mysterious scent for the evening. Notes of oud and amber.',
            price: 120.00,
            image: '/images/midnight-noir.jpg',
            slug: 'midnight-noir',
            gender: 'Men',
            category: 'Woody',
            topNotes: 'Bergamot, Pepper',
            heartNotes: 'Oud, Incense',
            baseNotes: 'Amber, Leather'
        },
        {
            name: 'Aurum Solis',
            description: 'Bright and radiant like the sun. Citrus notes with a floral heart.',
            price: 95.00,
            image: '/images/aurum-solis.jpg',
            slug: 'aurum-solis',
            gender: 'Women',
            category: 'Floral',
            topNotes: 'Lemon, Neroli',
            heartNotes: 'Jasmine, Rose',
            baseNotes: 'Musk, Vanilla'
        },
        {
            name: 'Ember Rose',
            description: 'A smoky rose fragrance that leaves a lasting impression.',
            price: 110.00,
            image: '/images/ember-rose.jpg',
            slug: 'ember-rose',
            gender: 'Unisex',
            category: 'Floral',
            topNotes: 'Pink Pepper, Cloves',
            heartNotes: 'Rose, Guaiac Wood',
            baseNotes: 'Vetiver, Patchouli'
        },
        {
            name: 'Oceanic Drift',
            description: 'A fresh, aquatic scent reminiscent of the deep blue sea.',
            price: 85.00,
            image: '/images/oceanic-drift.jpg',
            slug: 'oceanic-drift',
            gender: 'Men',
            category: 'Fresh',
            topNotes: 'Sea Salt, Mint',
            heartNotes: 'Sage, Rosemary',
            baseNotes: 'Cedarwood, Oakmoss'
        }
    ];

    console.log('Start seeding...');
    for (const p of products) {
        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: {},
            create: p,
        });
        console.log(`Created product with id: ${product.id}`);
    }
    console.log('Seeding finished.');
}

main()
    .then(async () => {
        await prisma.$disconnect();
    })
    .catch(async (e) => {
        console.error(e);
        await prisma.$disconnect();
        process.exit(1);
    });
