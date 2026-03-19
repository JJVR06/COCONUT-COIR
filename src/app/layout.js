import "./globals.css";
import { AppProvider } from "@/context/AppContext";

export const metadata = {
  title: "CoirCraft PH",
  description: "Eco-friendly coconut coir products from the Philippines",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}