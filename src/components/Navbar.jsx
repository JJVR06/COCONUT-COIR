import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-[#FDFCF0]">

      {/* Logo */}
      <div className="flex items-center gap-2 font-bold text-green-700 text-xl">
        <div className="w-6 h-6 bg-green-500 rounded-full"></div>
        CocoFiber
      </div>

      {/* Navigation Links */}
      <div className="flex gap-8 font-medium text-gray-700">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/history">History</Link>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-6">
        <span className="text-xl">🛒</span>

        <Link
          to="/login"
          className="bg-green-500 text-white px-5 py-2 rounded-full font-semibold hover:bg-green-600 transition"
        >
          Sign In
        </Link>
      </div>

    </nav>
  );
}