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
        {/*
          #app-root clips horizontal overflow (from the mobile drawer's
          translateX(110%) off-screen position) WITHOUT touching html or body.

          Why this works:
          - html and body have NO overflow set — the browser keeps the viewport
            as the natural scroll root, so the scroll wheel works on every page.
          - overflow-x: clip on #app-root cuts off horizontal bleed from
            transformed children (the slide-in drawer) but crucially does NOT
            create a scroll container the way overflow:hidden would, so it
            cannot produce a second scrollbar or lock vertical scrolling.
          - position:fixed children (navbar, drawer, mobile nav) escape the
            clip boundary and still render correctly over the full viewport.
        */}
        <div id="app-root">
          <AppProvider>
            {children}
            <MobileNavWrapper />
          </AppProvider>
        </div>
      </body>
    </html>
  );
}
