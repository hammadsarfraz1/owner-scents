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
        const { title, slug, content, isVisible } = body;

        const page = await prisma.infoPage.findUnique({ where: { id } });
        if (!page) {
            return NextResponse.json({ error: 'Page not found' }, { status: 404 });
        }

        let cleanSlug = page.slug;
        if (slug && slug.trim().toLowerCase() !== page.slug) {
            cleanSlug = slug.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
            const exists = await prisma.infoPage.findUnique({ where: { slug: cleanSlug } });
            if (exists) {
                return NextResponse.json({ error: 'A page with this slug already exists' }, { status: 400 });
            }
        }

        const updated = await prisma.infoPage.update({
            where: { id },
            data: {
                title: title !== undefined ? title.trim() : page.title,
                slug: cleanSlug,
                content: content !== undefined ? content : page.content,
                isVisible: isVisible !== undefined ? Boolean(isVisible) : page.isVisible
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Admin PUT info page error:', error);
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
        await prisma.infoPage.delete({ where: { id } });

        return NextResponse.json({ message: 'Page deleted successfully' });
    } catch (error) {
        console.error('Admin DELETE info page error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
