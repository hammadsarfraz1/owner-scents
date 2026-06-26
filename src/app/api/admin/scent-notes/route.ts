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

        const notes = await prisma.scentNote.findMany({
            orderBy: { name: 'asc' }
        });

        return NextResponse.json(notes);
    } catch (error) {
        console.error('Admin GET scent-notes error:', error);
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
        const { name, description } = body;

        if (!name || typeof name !== 'string' || !description || typeof description !== 'string') {
            return NextResponse.json({ error: 'Name and description are required' }, { status: 400 });
        }

        const cleanName = name.trim();
        const cleanDesc = description.trim();

        // Check if note description already exists
        const exists = await prisma.scentNote.findUnique({
            where: { name: cleanName }
        });

        if (exists) {
            return NextResponse.json({ error: 'Scent note description already exists' }, { status: 400 });
        }

        const newNote = await prisma.scentNote.create({
            data: { 
                name: cleanName,
                description: cleanDesc
            }
        });

        return NextResponse.json(newNote, { status: 201 });
    } catch (error) {
        console.error('Admin POST scent-notes error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
