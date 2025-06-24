// src/app/layout.tsx

import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import AuthButtons from "@/components/AuthButtons";
import Link from "next/link";
import Footer from "@/components/Footer";

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
});

export const metadata: Metadata = {
  title: "Imobiliária Pro",
  description: "O melhor site de imóveis da cidade",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`}>
      <body className={`font-sans bg-brand-light flex flex-col min-h-screen`}>
        <AuthProvider>
          <header className="p-4 bg-white border-b shadow-sm sticky top-0 z-50">
            <nav className="container mx-auto flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-brand-primary font-display">
                ImobiliáriaPRO
              </Link>
              <div>
                <AuthButtons />
              </div>
            </nav>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>
          
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}