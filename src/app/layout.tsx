import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar"; // Ensure Navbar is here if not inside page
import CartDrawer from "@/components/CartDrawer";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";
import TopPromoBar from "@/components/TopPromoBar";
import WhatsAppFloat from "@/components/WhatsAppFloat";

const plusJakartaSans = Plus_Jakarta_Sans({ subsets: ["latin"], variable: '--font-sans' });
const cinzel = Cinzel({ subsets: ["latin"], variable: '--font-serif' });

export const metadata: Metadata = {
  title: "Owner Scents | Exclusive Perfumery",
  description: "Experience the essence of luxury with Owner Scents.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning className={`${plusJakartaSans.variable} ${cinzel.variable}`}>
        <Providers>
          <TopPromoBar />
          <MobileHeader />
          <CartDrawer />
          <div style={{ position: 'relative', width: '100%' }}>
            {children}
          </div>
          <WhatsAppFloat />
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
