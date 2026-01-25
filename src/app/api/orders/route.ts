import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, address, city, postalCode, country, items, total } = body;

        // Validation (Basic)
        if (!name || !phone || !address || !city || !items || items.length === 0) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Create Order in Database
        const { getServerSession } = await import("next-auth");
        const { authOptions } = await import("@/lib/auth");
        const session = await getServerSession(authOptions);

        const order = await prisma.order.create({
            data: {
                shippingName: name,
                email: email,
                phoneNumber: phone,
                shippingAddress: address,
                city: city,
                postalCode: postalCode,
                country: country || 'Pakistan',
                total: total,
                status: 'PENDING',
                paymentMethod: 'COD',
                paymentStatus: 'PENDING',
                userId: (session?.user as any)?.id || null, // Link to user if logged in
                items: {
                    create: items.map((item: any) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: 0
                    }))
                }
            }
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error('Order creation error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
