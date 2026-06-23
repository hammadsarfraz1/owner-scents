import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        let config = await prisma.homepageConfig.findUnique({
            where: { id: 'singleton' }
        });

        // Initialize default configuration if it does not exist
        if (!config) {
            config = await prisma.homepageConfig.create({
                data: {
                    id: 'singleton'
                }
            });
        }

        return NextResponse.json(config);
    } catch (error) {
        console.error('Error fetching homepage config:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
