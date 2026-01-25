import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions as any) as any;
        if (!session || !session.user?.email) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await request.json();
        if (!productId) {
            return NextResponse.json({ error: "Product ID required" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email: session.user.email } });
        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        // Check if duplicate
        const existing = await prisma.wishlist.findUnique({
            where: {
                userId_productId: {
                    userId: user.id,
                    productId: productId
                }
            }
        });

        if (existing) {
            // Toggle off (remove)
            await prisma.wishlist.delete({
                where: { id: existing.id }
            });
            return NextResponse.json({ action: "removed" });
        } else {
            // Add
            await prisma.wishlist.create({
                data: {
                    userId: user.id,
                    productId: productId
                }
            });
            return NextResponse.json({ action: "added" });
        }

    } catch (error) {
        console.error("Wishlist error:", error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions as any) as any;
        if (!session || !session.user?.email) {
            return NextResponse.json({ wishlist: [] });
        }

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
            include: {
                wishlist: {
                    select: { productId: true }
                }
            }
        });

        if (!user) return NextResponse.json({ wishlist: [] });

        return NextResponse.json({ wishlist: user.wishlist.map(w => w.productId) });

    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
