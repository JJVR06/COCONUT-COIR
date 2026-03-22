import "./globals.css";
import { Plus_Jakarta_Sans, Nunito } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import MobileNavWrapper from "@/components/MobileNavWrapper";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: "CoirCraft PH",
  description: "Eco-friendly coconut coir products from the Philippines",
  icons: {
    icon: [
      { url: "/favicon.ico",    sizes: "any" },
      { url: "/icon-192.png",   sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png",   sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${nunito.variable}`}>
      <head>
        {/* Explicit link tags as fallback for older browsers */}
        <link rel="icon"             href="/favicon.ico"          sizes="any" />
        <link rel="icon"             href="/icon-192.png"         type="image/png" sizes="192x192" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" />
      </head>
      <body>
        <AppProvider>
          {children}
          <MobileNavWrapper />
        </AppProvider>
      </body>
    </html>
  );
}