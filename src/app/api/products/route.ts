import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Fetch categories that are explicitly hidden
        const hiddenCategories = await prisma.category.findMany({
            where: { isVisible: false },
            select: { name: true }
        });
        const hiddenNames = hiddenCategories.map(c => c.name);

        const products = await prisma.product.findMany({
            where: {
                isVisible: true,
                category: {
                    notIn: hiddenNames
                }
            }
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
    }
}
