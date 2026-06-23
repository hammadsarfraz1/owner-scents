import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const reviews = await prisma.review.findMany({
            where: { productId: id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(reviews);
    } catch (error) {
        console.error('Public GET product reviews error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const body = await req.json();
        const { name, rating, comment } = body;

        if (!name || rating === undefined || !comment) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const ratingNum = Number(rating);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return NextResponse.json({ error: 'Rating must be an integer between 1 and 5' }, { status: 400 });
        }

        // Validate that product exists
        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const dateString = new Date().toISOString().split('T')[0];

        const review = await prisma.review.create({
            data: {
                productId: id,
                name: name.trim(),
                rating: ratingNum,
                comment: comment.trim(),
                date: dateString
            }
        });

        return NextResponse.json(review, { status: 201 });
    } catch (error) {
        console.error('Public POST product reviews error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
