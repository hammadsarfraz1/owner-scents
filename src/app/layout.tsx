import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/Navbar"; // Ensure Navbar is here if not inside page
import CartDrawer from "@/components/CartDrawer";

export const metadata: Metadata = {
  title: "Owner Scents | Exclusive Perfumery",
  description: "Experience the essence of luxury with Owner Scents.",
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
          <CartDrawer />
          {children}
        </Providers>
      </body>
    </html>
  );
}
