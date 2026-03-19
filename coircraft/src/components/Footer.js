export default function Footer() {
  return (
    <footer className="bg-[#1a3009] text-green-200 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-3xl">🥥</span>
            <span className="text-white font-bold text-xl">CoirCraft PH</span>
          </div>
          <p className="text-sm text-green-400">
            Bringing sustainable, eco-friendly coconut coir products from the Philippines to your doorstep.
          </p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-1 text-sm">
            <li><a href="/" className="hover:text-white">Home</a></li>
            <li><a href="/store" className="hover:text-white">Store</a></li>
            <li><a href="/products" className="hover:text-white">Products</a></li>
            <li><a href="/login" className="hover:text-white">Login</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-3">Contact</h4>
          <p className="text-sm">📧 hello@coircraft.ph</p>
          <p className="text-sm">📞 +63 912 345 6789</p>
          <p className="text-sm">📍 Quezon City, Philippines</p>
        </div>
      </div>
      <div className="border-t border-green-800 py-4 text-center text-xs text-green-500 px-4">
        <p>© 2025 CoirCraft PH — Group Name & Logo | All Rights Reserved</p>
        <p className="mt-1 italic">
          For educational purposes only, and no copyright infringement is intended.
        </p>
      </div>
    </footer>
  );
}