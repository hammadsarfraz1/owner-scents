import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { name, description, price, originalPrice, isVisible, image, homepageImage, quickViewImage, image2, image3, gender, category, topNotes, heartNotes, baseNotes } = body;

        const product = await prisma.product.findUnique({ where: { id } });
        if (!product) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // Generate new slug if name changed
        let slug = product.slug;
        if (name && name !== product.name) {
            slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
            const exists = await prisma.product.findUnique({ where: { slug } });
            if (exists) {
                slug = `${slug}-${Math.random().toString(36).substring(2, 7)}`;
            }
        }

        const updated = await prisma.product.update({
            where: { id },
            data: {
                name: name !== undefined ? name : product.name,
                description: description !== undefined ? description : product.description,
                price: price !== undefined ? Number(price) : product.price,
                originalPrice: originalPrice !== undefined ? (originalPrice ? Number(originalPrice) : null) : product.originalPrice,
                isVisible: isVisible !== undefined ? Boolean(isVisible) : product.isVisible,
                image: image !== undefined ? image : product.image,
                homepageImage: homepageImage !== undefined ? homepageImage : product.homepageImage,
                quickViewImage: quickViewImage !== undefined ? quickViewImage : product.quickViewImage,
                image2: image2 !== undefined ? image2 : product.image2,
                image3: image3 !== undefined ? image3 : product.image3,
                slug,
                gender: gender !== undefined ? gender : product.gender,
                category: category !== undefined ? category : product.category,
                topNotes: topNotes !== undefined ? topNotes : product.topNotes,
                heartNotes: heartNotes !== undefined ? heartNotes : product.heartNotes,
                baseNotes: baseNotes !== undefined ? baseNotes : product.baseNotes
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Admin PUT product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        await prisma.product.delete({ where: { id } });

        return NextResponse.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Admin DELETE product error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
