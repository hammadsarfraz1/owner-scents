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
        const { name, description } = body;

        const note = await prisma.scentNote.findUnique({ where: { id } });
        if (!note) {
            return NextResponse.json({ error: 'Scent note not found' }, { status: 404 });
        }

        if (name && name.trim() !== note.name) {
            const cleanName = name.trim();
            const exists = await prisma.scentNote.findUnique({ where: { name: cleanName } });
            if (exists) {
                return NextResponse.json({ error: 'Scent note name already exists' }, { status: 400 });
            }
        }

        const updated = await prisma.scentNote.update({
            where: { id },
            data: {
                name: name !== undefined ? name.trim() : note.name,
                description: description !== undefined ? description.trim() : note.description
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Admin PUT scent-note error:', error);
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
        await prisma.scentNote.delete({ where: { id } });

        return NextResponse.json({ message: 'Scent note deleted successfully' });
    } catch (error) {
        console.error('Admin DELETE scent-note error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
