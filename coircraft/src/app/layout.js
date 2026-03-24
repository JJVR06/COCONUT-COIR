import "./globals.css";
import { Plus_Jakarta_Sans, Nunito } from "next/font/google";
import { AppProvider } from "@/context/AppContext";
import MobileNavWrapper from "@/components/MobileNavWrapper";
import AnnouncementBanner from "@/components/AnnouncementBanner";

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
        <div id="app-root">
          <AppProvider>
            {/*
              AnnouncementBanner renders as position:fixed so it sits above
              everything. It also outputs a same-height spacer div so the sticky
              Navbar (position:sticky, top:0) naturally sits below the banner
              rather than being hidden behind it.
              The banner is NOT rendered on seller pages — the component returns
              null when the storefront announcement is empty.
            */}
            <AnnouncementBanner />
            {children}
            <MobileNavWrapper />
          </AppProvider>
        </div>
      </body>
    </html>
  );
}