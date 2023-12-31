import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "./_hooks/useAuth";
import { Toaster } from "./_components/ui/toaster";
import { HelpersProvider } from "./_hooks/use-helpers";

const roboto = Roboto({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LetterLinc",
  description: "Personalized Cover Letter Generator",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <AuthProvider>
        <HelpersProvider>
          <body className={roboto.className}>
            {children}
            <Toaster />
          </body>
        </HelpersProvider>
      </AuthProvider>
    </html>
  );
}
