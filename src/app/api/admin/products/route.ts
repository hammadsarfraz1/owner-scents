import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const products = await prisma.product.findMany({
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error('Admin GET products error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        const { name, description, price, originalPrice, isVisible, image, image2, image3, gender, category, topNotes, heartNotes, baseNotes } = body;

        if (!name || !description || price === undefined || !image) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Generate clean unique slug
        let slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
        const exists = await prisma.product.findUnique({ where: { slug } });
        if (exists) {
            slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
        }

        const product = await prisma.product.create({
            data: {
                name,
                description,
                price: Number(price),
                originalPrice: originalPrice ? Number(originalPrice) : null,
                isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
                image,
                image2: image2 || '',
                image3: image3 || '',
                slug,
                gender: gender || 'Unisex',
                category: category || 'Signature',
                topNotes: topNotes || '',
                heartNotes: heartNotes || '',
                baseNotes: baseNotes || ''
            }
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error('Admin POST products error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
