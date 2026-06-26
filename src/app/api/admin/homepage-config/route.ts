import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function PUT(req: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session || (session.user as any).role !== 'ADMIN') {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await req.json();
        
        const config = await prisma.homepageConfig.upsert({
            where: { id: 'singleton' },
            update: {
                card1Name: body.card1Name,
                card1Edition: body.card1Edition,
                card1Image: body.card1Image,
                card1Link: body.card1Link,
                card2Name: body.card2Name,
                card2Edition: body.card2Edition,
                card2Image: body.card2Image,
                card2Link: body.card2Link,
                card3Name: body.card3Name,
                card3Edition: body.card3Edition,
                card3Image: body.card3Image,
                card3Link: body.card3Link,
                split1Title: body.split1Title,
                split1Image: body.split1Image,
                split1Link: body.split1Link,
                split2Title: body.split2Title,
                split2Image: body.split2Image,
                split2Link: body.split2Link,
                shippingPrice: body.shippingPrice !== undefined ? Number(body.shippingPrice) : undefined,
                freeShippingThreshold: body.freeShippingThreshold !== undefined ? Number(body.freeShippingThreshold) : undefined,
                promoText: body.promoText !== undefined ? body.promoText : undefined,
                showPromo: body.showPromo !== undefined ? Boolean(body.showPromo) : undefined,
                whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : undefined,
                showWhatsapp: body.showWhatsapp !== undefined ? Boolean(body.showWhatsapp) : undefined,
            },
            create: {
                id: 'singleton',
                card1Name: body.card1Name,
                card1Edition: body.card1Edition,
                card1Image: body.card1Image,
                card1Link: body.card1Link,
                card2Name: body.card2Name,
                card2Edition: body.card2Edition,
                card2Image: body.card2Image,
                card2Link: body.card2Link,
                card3Name: body.card3Name,
                card3Edition: body.card3Edition,
                card3Image: body.card3Image,
                card3Link: body.card3Link,
                split1Title: body.split1Title,
                split1Image: body.split1Image,
                split1Link: body.split1Link,
                split2Title: body.split2Title,
                split2Image: body.split2Image,
                split2Link: body.split2Link,
                shippingPrice: body.shippingPrice !== undefined ? Number(body.shippingPrice) : 250,
                freeShippingThreshold: body.freeShippingThreshold !== undefined ? Number(body.freeShippingThreshold) : 3000,
                promoText: body.promoText !== undefined ? body.promoText : "Enjoy Free Shipping on Orders Above Rs. 3,000",
                showPromo: body.showPromo !== undefined ? Boolean(body.showPromo) : true,
                whatsappNumber: body.whatsappNumber !== undefined ? body.whatsappNumber : "923001234567",
                showWhatsapp: body.showWhatsapp !== undefined ? Boolean(body.showWhatsapp) : true,
            }
        });

        return NextResponse.json(config);
    } catch (error) {
        console.error('Admin PUT homepage config error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
