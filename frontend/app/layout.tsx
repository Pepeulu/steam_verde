import type { Metadata } from "next";
import { Cinzel, Spectral, Space_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/components/AuthProvider";
import Header from "@/components/Header";

const cinzel = Cinzel({ subsets: ["latin"], weight: ["400", "600", "700", "900"], variable: "--font-cinzel" });
const spectral = Spectral({ subsets: ["latin"], weight: ["300", "400", "500", "600"], variable: "--font-spectral" });
const spaceMono = Space_Mono({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-space-mono" });

export const metadata: Metadata = {
  title: "Wilderfeast — Diário do Caçador",
  description: "Sistema de fichas e bestiário para o RPG Wilderfeast.",
  icons: { icon: "/textures/favicon.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-br" className={`${cinzel.variable} ${spectral.variable} ${spaceMono.variable}`}>
      <body>
        <AuthProvider>
          <Header />
          <main className="pt-20 min-h-screen">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
