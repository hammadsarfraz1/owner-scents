import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const defaultPages = [
    {
        slug: 'shipping-returns',
        title: 'Shipping & Returns',
        content: `ORDER PROCESSING
All orders are processed within 1-2 business days after payment confirmation. Orders placed on weekends or public holidays will be processed the next business day.

DELIVERY
We deliver across Pakistan.
Karachi, Lahore, Islamabad — 2-3 business days
Other cities — 3-5 business days
Remote areas — 5-7 business days

Free delivery on all orders above Rs. 3,000.
Standard delivery charges: Rs. 200

PAYMENT
We accept:
Cash on Delivery (COD)
Bank Transfer
JazzCash / EasyPaisa

ORDER TRACKING
Once your order is dispatched you will receive a tracking number via WhatsApp.

RETURNS & EXCHANGES
We accept returns within 7 days of delivery if:
Product is unopened and unused
Original packaging is intact
You have proof of purchase

We do not accept returns on opened or used fragrances due to hygiene reasons.

DAMAGED ORDERS
If your order arrives damaged, contact us within 24 hours via WhatsApp with a photo of the damage. We will replace it immediately.

CONTACT
For any order queries contact us on WhatsApp — link in the footer.`
    },
    {
        slug: 'contact',
        title: 'Contact Concierge',
        content: `THE HAUTE PARFUMERIE
CONTACT CONCIERGE
We are here to assist you with anything — orders, fragrance recommendations, delivery queries, or anything else. Your experience with Owner Scents matters to us.

WHATSAPP
Available 24 hours, 7 days a week.
Chat on WhatsApp — wa.me/923000000000

EMAIL
For detailed queries and order concerns.
support@ownerscents.com

RESPONSE TIME
WhatsApp — Instant, 24/7.

BUSINESS HOURS
Available 24 hours, 7 days a week

SEND A MESSAGE
Name, Phone Number, Message
Send Message`
    },
    {
        slug: 'privacy-policy',
        title: 'Privacy Policy',
        content: `Last updated: June 2026

INFORMATION WE COLLECT
When you place an order or contact us we may collect:
Your name
Phone number
Delivery address
Email address
Order history

HOW WE USE YOUR INFORMATION
We use your information only to:
Process and deliver your orders
Send order updates via WhatsApp
Respond to your queries
Improve our service

WE NEVER:
Sell your personal information to third parties
Share your data with advertisers
Send spam messages

WHATSAPP COMMUNICATION
By contacting us on WhatsApp you consent to receiving order updates and occasional product announcements. You can opt out anytime by messaging STOP.

COOKIES & TRACKING
Our website uses Google Analytics and Microsoft Clarity to understand how visitors use our site. This data is anonymous and helps us improve your experience. No personal data is collected through these tools.

DATA SECURITY
We take reasonable steps to protect your personal information. Your data is stored securely and accessed only by authorized team members.

YOUR RIGHTS
You have the right to:
Request your data be deleted
Opt out of marketing messages
Ask what data we hold about you
Contact us via WhatsApp for any data requests.

CHANGES TO THIS POLICY
We may update this policy occasionally. Changes will be posted on this page.

CONTACT
For privacy concerns contact us on WhatsApp — link in the footer.`
    }
];

export async function GET() {
    try {
        // Ensure default pages exist only if database is completely empty
        const count = await prisma.infoPage.count();
        if (count === 0) {
            for (const page of defaultPages) {
                await prisma.infoPage.create({
                    data: {
                        slug: page.slug,
                        title: page.title,
                        content: page.content,
                        isVisible: true
                    }
                });
            }
        }

        const pages = await prisma.infoPage.findMany({
            where: { isVisible: true },
            select: { id: true, slug: true, title: true, content: true },
            orderBy: { createdAt: 'asc' }
        });

        return NextResponse.json(pages);
    } catch (error) {
        console.error('Public GET info pages error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
