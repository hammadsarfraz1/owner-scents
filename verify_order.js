const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const orders = await prisma.order.findMany({
        include: { items: true },
        orderBy: { createdAt: 'desc' },
        take: 1
    })
    console.log(JSON.stringify(orders, null, 2))
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
