import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

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

        let grossRevenue = 0;
        let netRevenue = 0;
        let returnedValue = 0;
        let refundedValue = 0;
        
        let totalOrders = orders.length;
        let deliveredOrders = 0;
        let returnedOrders = 0;
        let cancelledOrders = 0;
        let pendingOrders = 0;
        let refundedOrders = 0;
        let totalItemsSold = 0;

        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentYear = new Date().getFullYear();

        // Initialize 12 months structure
        const monthlyMap: Record<string, { month: string; revenue: number; orders: number; returned: number }> = {};
        months.forEach(m => {
            monthlyMap[m] = { month: m, revenue: 0, orders: 0, returned: 0 };
        });

        // Initialize yearly & category & product maps
        const yearlyMap: Record<string, { year: string; revenue: number; orders: number }> = {};
        const categoryMap: Record<string, number> = {};
        const productMap: Record<string, { name: string; image: string; qty: number; revenue: number }> = {};

        orders.forEach(order => {
            const rev = Number(order.total) || 0;
            const status = (order.status || 'PENDING').toUpperCase();
            const payStatus = (order.paymentStatus || 'PENDING').toUpperCase();

            grossRevenue += rev;

            if (payStatus === 'REFUNDED') {
                refundedOrders += 1;
                refundedValue += rev;
            }

            if (status === 'DELIVERED') {
                deliveredOrders += 1;
                netRevenue += rev;
            } else if (status === 'RETURNED') {
                returnedOrders += 1;
                returnedValue += rev;
            } else if (status === 'CANCELLED') {
                cancelledOrders += 1;
            } else {
                pendingOrders += 1;
                netRevenue += rev;
            }

            const date = new Date(order.createdAt);
            const yr = date.getFullYear().toString();
            const mo = months[date.getMonth()];

            // Yearly aggregation
            if (status !== 'CANCELLED' && status !== 'RETURNED') {
                if (!yearlyMap[yr]) {
                    yearlyMap[yr] = { year: yr, revenue: 0, orders: 0 };
                }
                yearlyMap[yr].revenue += rev;
                yearlyMap[yr].orders += 1;
            }

            // Monthly aggregation
            if (date.getFullYear() === currentYear) {
                monthlyMap[mo].orders += 1;
                if (status === 'RETURNED') {
                    monthlyMap[mo].returned += 1;
                } else if (status !== 'CANCELLED') {
                    monthlyMap[mo].revenue += rev;
                }
            }

            // Items breakdown
            if (status !== 'CANCELLED') {
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
            }
        });

        const monthlySales = Object.values(monthlyMap);
        const yearlySales = Object.values(yearlyMap).sort((a, b) => Number(a.year) - Number(b.year));

        // Format category breakdown with percentages
        const activeCatTotal = Object.values(categoryMap).reduce((a, b) => a + b, 0);
        const categorySales = Object.entries(categoryMap).map(([category, revenue]) => ({
            category,
            revenue,
            percentage: activeCatTotal > 0 ? Math.round((revenue / activeCatTotal) * 100) : 0
        })).sort((a, b) => b.revenue - a.revenue);

        // Format top products
        const topProducts = Object.values(productMap)
            .sort((a, b) => b.revenue - a.revenue)
            .slice(0, 5);

        const averageOrderValue = totalOrders > 0 ? Math.round(grossRevenue / totalOrders) : 0;

        const response = NextResponse.json({
            kpis: {
                grossRevenue,
                netRevenue,
                returnedValue,
                refundedValue,
                totalOrders,
                deliveredOrders,
                returnedOrders,
                cancelledOrders,
                pendingOrders,
                refundedOrders,
                averageOrderValue,
                totalItemsSold
            },
            monthlySales,
            yearlySales,
            categorySales,
            topProducts
        });
        response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        response.headers.set('Pragma', 'no-cache');
        response.headers.set('Expires', '0');

        return response;
    } catch (error) {
        console.error('Admin Analytics Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
