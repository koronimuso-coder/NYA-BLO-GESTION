import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { Assistant } from "@/components/ai/Assistant";

export const metadata: Metadata = {
  title: "NYA BLO BUSINESS OS",
  description: "Système de pilotage intégré pour NYA BLO SARL et partenaires",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className="min-h-screen bg-background antialiased selection:bg-dogon-indigo/30">
        <AuthProvider>
          {children}
          <Assistant />
        </AuthProvider>
      </body>
    </html>
  );
}
