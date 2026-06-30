import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, Cinzel } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import MainHeader from "@/components/MainHeader";
import CartDrawer from "@/components/CartDrawer";
import MobileBottomNav from "@/components/MobileBottomNav";
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
      <head>
        <script
          type="text/javascript"
          dangerouslySetInnerHTML={{
            __html: `
              (function(c,l,a,r,i,t,y){
                  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
              })(window, document, "clarity", "script", "xe5fz7h3nw");
            `
          }}
        />
      </head>
      <body suppressHydrationWarning className={`${plusJakartaSans.variable} ${cinzel.variable}`}>
        <Providers>
          <MainHeader />
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
