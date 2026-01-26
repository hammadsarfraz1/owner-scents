import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar"; // Ensure Navbar is here if not inside page
import CartDrawer from "@/components/CartDrawer";
import MobileHeader from "@/components/MobileHeader";
import MobileBottomNav from "@/components/MobileBottomNav";

export const metadata: Metadata = {
  title: "Owner Scents | Exclusive Perfumery",
  description: "Experience the essence of luxury with Owner Scents.",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <MobileHeader />
          <CartDrawer />
          {children}
          <MobileBottomNav />
        </Providers>
      </body>
    </html>
  );
}
