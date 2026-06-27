import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { 
            name, 
            email, 
            phone, 
            address, 
            city, 
            postalCode, 
            country, 
            items, 
            total, 
            paymentMethod, 
            paymentStatus 
        } = body;

        // Basic Validation
        if (!name || !phone || !address || !city || !postalCode || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check user session
        const session = await getServerSession(authOptions);

        // Query product prices from DB
        const productIds = items.map((item: any) => item.productId);
        const dbProducts = await prisma.product.findMany({
            where: { id: { in: productIds } }
        });

        const order = await prisma.order.create({
            data: {
                shippingName: name,
                email: email || null,
                phoneNumber: phone,
                shippingAddress: address,
                city: city,
                postalCode: postalCode,
                country: country || 'Pakistan',
                total: total,
                status: 'PENDING',
                paymentMethod: paymentMethod || 'COD',
                paymentStatus: paymentStatus || 'PENDING',
                userId: (session?.user as any)?.id || null,
                items: {
                    create: items.map((item: any) => {
                        const dbProduct = dbProducts.find(p => p.id === item.productId);
                        const price = dbProduct ? dbProduct.price : 0;
                        return {
                            productId: item.productId,
                            quantity: item.quantity,
                            price: price
                        };
                    })
                }
            }
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
