import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const pages = await prisma.infoPage.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(pages);
    } catch (error) {
        console.error('Admin GET info pages error:', error);
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
        const { title, slug, content, isVisible } = body;

        if (!title || !slug || !content) {
            return NextResponse.json({ error: 'Title, slug, and content are required' }, { status: 400 });
        }

        const cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');

        const exists = await prisma.infoPage.findUnique({
            where: { slug: cleanSlug }
        });

        if (exists) {
            return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 400 });
        }

        const page = await prisma.infoPage.create({
            data: {
                title: title.trim(),
                slug: cleanSlug,
                content: content,
                isVisible: isVisible !== undefined ? Boolean(isVisible) : true
            }
        });

        return NextResponse.json(page, { status: 201 });
    } catch (error) {
        console.error('Admin POST info page error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
