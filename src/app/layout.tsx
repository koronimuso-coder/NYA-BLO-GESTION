import type { Metadata, Viewport } from "next";
import { Inter, Outfit } from "next/font/google";
import { AuthProvider } from "@/context/AuthContext";
import { Toaster } from "react-hot-toast";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NYA BLO GESTION | Dogon Business OS",
  description: "Système d'exploitation commercial premium inspiré de l'excellence Dogon pour NYA BLO SARL.",
  keywords: "gestion, commerciale, B2B, Dogon, SaaS, Ivoirien, West Africa Business",
  icons: {
    icon: "/favicon.ico",
  }
};

export const viewport: Viewport = {
  themeColor: "#5C3D2E",
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
    <html
      lang="fr"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full font-sans selection:bg-[#D4AF37]/30 bg-[#FAF3E0]">
        <AuthProvider>
          {children}
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#FFFFFF',
                color: '#5C3D2E',
                border: '1px solid #E8DCC4',
                borderRadius: '16px',
                fontWeight: 'bold',
                fontFamily: 'var(--font-outfit)'
              },
              success: {
                iconTheme: {
                  primary: '#A66037',
                  secondary: '#FFFFFF',
                },
              },
            }} 
          />
        </AuthProvider>
      </body>
    </html>
  );
}
