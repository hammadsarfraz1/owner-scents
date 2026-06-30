import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !(session.user as any).id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const conditions: any[] = [
            { userId: (session.user as any).id }
        ];

        if (session.user?.email) {
            conditions.push({ email: session.user.email });
        }

        const orders = await prisma.order.findMany({
            where: {
                OR: conditions
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(orders);
    } catch (error) {
        console.error('Fetch orders error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
