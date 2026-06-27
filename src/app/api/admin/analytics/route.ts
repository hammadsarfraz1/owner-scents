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

        const orders = await prisma.order.findMany({
            include: {
                items: {
                    include: {
                        product: true
                    }
                }
            },
            orderBy: { createdAt: 'asc' }
        });

        let totalRevenue = 0;
        let totalOrders = orders.length;
        let totalItemsSold = 0;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        // Initialize 12 months structure
        const monthlyMap: Record<string, { month: string; revenue: number; orders: number }> = {};
        months.forEach(m => {
            monthlyMap[m] = { month: m, revenue: 0, orders: 0 };
        });

        // Initialize yearly & category & product maps
        const yearlyMap: Record<string, { year: string; revenue: number; orders: number }> = {};
        const categoryMap: Record<string, number> = {};
        const productMap: Record<string, { name: string; image: string; qty: number; revenue: number }> = {};

        orders.forEach(order => {
            const rev = Number(order.total) || 0;
            totalRevenue += rev;

            const date = new Date(order.createdAt);
            const yr = date.getFullYear().toString();
            const mo = months[date.getMonth()];

            // Yearly aggregation
            if (!yearlyMap[yr]) {
                yearlyMap[yr] = { year: yr, revenue: 0, orders: 0 };
            }
            yearlyMap[yr].revenue += rev;
            yearlyMap[yr].orders += 1;

            // Monthly aggregation (for current year or all)
            if (date.getFullYear() === currentYear) {
                monthlyMap[mo].revenue += rev;
                monthlyMap[mo].orders += 1;
            }

            // Items breakdown
            order.items.forEach(item => {
                const qty = item.quantity || 1;
                const price = Number(item.price) > 0 ? Number(item.price) : Number(item.product?.price || 0);
                const itemRev = price * qty;
                totalItemsSold += qty;

                // Category
                const cat = item.product?.category || 'Uncategorized';
                categoryMap[cat] = (categoryMap[cat] || 0) + itemRev;

                // Product
                const pId = item.productId || item.product?.id || item.product?.name || 'unknown';
                if (!productMap[pId]) {
                    productMap[pId] = {
                        name: item.product?.name || 'Fragrance Product',
                        image: item.product?.image || 'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=400&q=80',
                        qty: 0,
                        revenue: 0
                    };
                }
                productMap[pId].qty += qty;
                productMap[pId].revenue += itemRev;
            });
        });

        const monthlySales = Object.values(monthlyMap);
        const yearlySales = Object.values(yearlyMap).sort((a, b) => Number(a.year) - Number(b.year));

        // Format category breakdown with percentages
        const categorySales = Object.entries(categoryMap).map(([category, revenue]) => ({
            category,
            revenue,
            percentage: totalRevenue > 0 ? Math.round((revenue / totalRevenue) * 100) : 0
        })).sort((a, b) => b.revenue - a.revenue);

        // Format top products
        const topProducts = Object.values(productMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        return NextResponse.json({
            kpis: {
                totalRevenue,
                totalOrders,
                averageOrderValue,
                totalItemsSold
            },
            monthlySales,
            yearlySales,
            categorySales,
            topProducts
        });
    } catch (error) {
        console.error('Admin Analytics Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
