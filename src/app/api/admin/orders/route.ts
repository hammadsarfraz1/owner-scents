import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Security check: must be an authenticated ADMIN
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Fetch all orders with associated items and products
        const orders = await prisma.order.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                user: {
                    select: {
                        name: true
                    }
                }
            }
        });

        const response = NextResponse.json(orders);
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Admin orders fetch error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
