
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Start seeding ...')

    const products = [
        {
            name: "Midnight OUD",
            description: "A rich, woody scent with notes of amber and musk.",
            price: 45.00,
            image: "https://images.unsplash.com/photo-1594035910387-fea4779426e9?auto=format&fit=crop&w=800&q=80",
            gender: "Men",
            category: "Signature",
            slug: "midnight-oud",
            topNotes: "Bergamot, Oregano",
            heartNotes: "Amber, Opoponax",
            baseNotes: "Leather, Sandalwood, Agarwood"
        },
        {
            name: "Rose Elixir",
            description: "A delicate blend of blooming roses and sweet vanilla.",
            price: 55.00,
            image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=800&q=80",
            gender: "Women",
            category: "Floral",
            slug: "rose-elixir",
            topNotes: "Red Rose, Peony",
            heartNotes: "Lily of the Valley, Iris",
            baseNotes: "Vanila, White Musk"
        },
        {
            name: "Ocean Breeze",
            description: "Fresh aquatic notes reminiscent of the sea.",
            price: 35.00,
            image: "https://images.unsplash.com/photo-1615655406736-b37c4fabf923?auto=format&fit=crop&w=800&q=80",
            gender: "Unisex",
            category: "Fresh",
            slug: "ocean-breeze",
            topNotes: "Sea Salt, Citrus",
            heartNotes: "Sage, Seaweed",
            baseNotes: "Amber, Cedarwood"
        },
        {
            name: "Santal Royal",
            description: "An elegant and mysterious woody fragrance.",
            price: 89.00,
            image: "https://images.unsplash.com/photo-1616949755610-8c9bbc08f138?auto=format&fit=crop&w=800&q=80",
            gender: "Unisex",
            category: "Woody",
            slug: "santal-royal",
            topNotes: "Neroli, Jasmine",
            heartNotes: "Peach, Cinnamon",
            baseNotes: "Sandalwood, Oud, Leather"
        },
        {
            name: "Citrus Splash",
            description: "A vibrant and energetic citrus explosion.",
            price: 40.00,
            image: "https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?auto=format&fit=crop&w=800&q=80",
            gender: "Unisex",
            category: "Citrus",
            slug: "citrus-splash",
            topNotes: "Lemon, Lime, Mandarin",
            heartNotes: "Basil, Thyme",
            baseNotes: "Vetiver, Patchouli"
        },
        {
            name: "Velvet Orchid",
            description: "A luxurious and sensual floral amber fragrance.",
            price: 75.00,
            image: "https://images.unsplash.com/photo-1595425970377-c9703cf48b6d?auto=format&fit=crop&w=800&q=80",
            gender: "Women",
            category: "Oriental",
            slug: "velvet-orchid",
            topNotes: "Rum, Honey, Mandarin",
            heartNotes: "Black Orchid, Jasmine",
            baseNotes: "Myrrh, Vanilla, Suede"
        }
    ]

    for (const p of products) {
        const product = await prisma.product.upsert({
            where: { slug: p.slug },
            update: {
                name: p.name,
                description: p.description,
                price: p.price,
                image: p.image,
                gender: p.gender,
                category: p.category,
                topNotes: p.topNotes,
                heartNotes: p.heartNotes,
                baseNotes: p.baseNotes,
            },
            create: p,
        })
        console.log(`Created product with id: ${product.id}`)
    }
    console.log('Seeding finished.')
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
