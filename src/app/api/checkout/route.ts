import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        const body = await request.json();
        const { items, total, shippingDetails } = body;

        if (!items || items.length === 0) {
            return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
        }

        // Create the order
        const order = await prisma.order.create({
            data: {
                total: total,
                status: "PAID", // Simulating instant payment
                userId: (session?.user as any)?.id || null, // Link to user if logged in
                shippingName: shippingDetails?.name || "Guest", // ADDED
                email: shippingDetails?.email || (session?.user as any)?.email || null, // ADDED
                shippingAddress: shippingDetails?.address || "",
                city: shippingDetails?.city || "",
                postalCode: shippingDetails?.postalCode || "",
                country: shippingDetails?.country || "Pakistan",
                phoneNumber: shippingDetails?.phoneNumber || "",
                items: {
                    create: items.map((item: any) => ({
                        productId: item.id,
                        quantity: item.quantity,
                        price: item.price
                    }))
                }
            }
        });

        return NextResponse.json({ success: true, orderId: order.id });
    } catch (error) {
        console.error("Checkout error:", error);
        return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
    }
}
