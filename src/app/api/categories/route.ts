import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        // Ensure default categories exist
        const defaultCategories = ['Summer Perfumes', 'Office Perfumes', 'Western Perfumes', 'Gift Boxes'];
        
        for (const catName of defaultCategories) {
            const exists = await prisma.category.findUnique({ where: { name: catName } });
            if (!exists) {
                await prisma.category.create({
                    data: { name: catName, isVisible: true }
                });
            }
        }

        const categories = await prisma.category.findMany({
            where: { isVisible: true },
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Public GET categories error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
