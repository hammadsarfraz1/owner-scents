import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
    try {
        const defaultCategories = ['Summer Perfumes', 'Office Perfumes', 'Western Perfumes', 'Gift Boxes'];
        for (const catName of defaultCategories) {
            const exists = await prisma.category.findUnique({ where: { name: catName } });
            if (!exists) {
                await prisma.category.create({
                    data: { name: catName, isVisible: true, gender: 'All' }
                });
            }
        }

        const categories = await prisma.category.findMany({
            orderBy: { createdAt: 'asc' }
        });
        return NextResponse.json(categories);
    } catch (error) {
        console.error('Admin GET categories error:', error);
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
        const { name, isVisible, gender } = body;

        if (!name || typeof name !== 'string') {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const cleanName = name.trim();

        const exists = await prisma.category.findUnique({
            where: { name: cleanName }
        });

        if (exists) {
            return NextResponse.json({ error: 'Category already exists' }, { status: 400 });
        }

        const category = await prisma.category.create({
            data: { 
                name: cleanName,
                isVisible: isVisible !== undefined ? Boolean(isVisible) : true,
                gender: gender || 'All'
            }
        });

        return NextResponse.json(category, { status: 201 });
    } catch (error) {
        console.error('Admin POST categories error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
