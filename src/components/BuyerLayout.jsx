import Navbar from "./Navbar";
import Footer from "./Footer";
import { Outlet } from "react-router-dom";

export default function BuyerLayout() {
  return (
    <div className="flex flex-col min-h-screen bg-[#FDFCF0]">

      <Navbar />

      <main className="grow">
        <Outlet />
      </main>

      <Footer />

    </div>
  );
}