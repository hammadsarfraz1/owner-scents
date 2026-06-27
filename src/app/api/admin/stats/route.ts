import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        // Secure Endpoint
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Parallel Data Fetching with 100% precise status matching
        const [totalOrders, pendingOrders, totalRevenueData, recentOrders] = await Promise.all([
            prisma.order.count(),
            prisma.order.count({ where: { status: { in: ['PENDING', 'ORDERED'] } } }),
            prisma.order.aggregate({
                where: { 
                    status: { notIn: ['CANCELLED', 'RETURNED'] } 
                },
                _sum: { total: true }
            }),
            prisma.order.findMany({
                take: 5,
                orderBy: { createdAt: 'desc' },
                include: { user: { select: { name: true } } }
            })
        ]);

        const response = NextResponse.json({
            totalOrders,
            pendingOrders,
            totalRevenue: Number(totalRevenueData._sum.total) || 0,
            recentOrders
        });

        // Strict anti-caching headers for 100% real-time data accuracy
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;

    } catch (error) {
        console.error('Admin stats error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
