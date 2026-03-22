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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${jakarta.variable} ${nunito.variable}`}>
      <body>
        <AppProvider>
          {children}
          <MobileNavWrapper />
        </AppProvider>
      </body>
    </html>
  );
}