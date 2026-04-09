import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Calculator Taxe România  - Angajat vs PFA vs SRL",
  description:
    "Compară taxele pentru PFA (Sistem Real, Norma de Venit), SRL (Micro, Impozit Profit) și Angajat. Află câți bani îți rămân în mână.",
  keywords: [
    "calculator taxe",
    "PFA",
    "SRL",
    "angajat",
    "taxe Romania",
    "impozit",
    "CAS",
    "CASS",
    "micro-intreprindere",
    "norma de venit",
  ],
  openGraph: {
    title: "Calculator Taxe România  - Angajat vs PFA vs SRL",
    description:
      "Compară structurile fiscale și află câți bani îți rămân în mână.",
    type: "website",
    locale: "ro_RO",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ro" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-zinc-50 text-zinc-900 font-sans">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
