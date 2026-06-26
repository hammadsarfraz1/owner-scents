import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        // Security check: must be an authenticated ADMIN
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;
        const body = await req.json();
        const { status, paymentStatus } = body;

        const updatedData: any = {};
        if (status !== undefined) updatedData.status = status;
        if (paymentStatus !== undefined) updatedData.paymentStatus = paymentStatus;

        const order = await prisma.order.update({
            where: { id },
            data: updatedData
        });

        return NextResponse.json(order);
    } catch (error) {
        console.error('Admin PUT order error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        // Security check: must be an authenticated ADMIN
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = await params;

        // Perform inside a transaction to handle foreign key constraints on OrderItems
        await prisma.$transaction([
            prisma.orderItem.deleteMany({
                where: { orderId: id }
            }),
            prisma.order.delete({
                where: { id }
            })
        ]);

        return NextResponse.json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Admin DELETE order error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
