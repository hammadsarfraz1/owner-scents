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
        const { name, isVisible, gender } = body;

        const category = await prisma.category.findUnique({ where: { id } });
        if (!category) {
            return NextResponse.json({ error: 'Category not found' }, { status: 404 });
        }

        if (name && name.trim() !== category.name) {
            const cleanName = name.trim();
            const exists = await prisma.category.findUnique({ where: { name: cleanName } });
            if (exists) {
                return NextResponse.json({ error: 'Category name already exists' }, { status: 400 });
            }
        }

        const updated = await prisma.category.update({
            where: { id },
            data: {
                name: name !== undefined ? name.trim() : category.name,
                isVisible: isVisible !== undefined ? Boolean(isVisible) : category.isVisible,
                gender: gender !== undefined ? gender : category.gender
            }
        });

        return NextResponse.json(updated);
    } catch (error) {
        console.error('Admin PUT category error:', error);
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
        await prisma.category.delete({ where: { id } });

        return NextResponse.json({ message: 'Category deleted successfully' });
    } catch (error) {
        console.error('Admin DELETE category error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
