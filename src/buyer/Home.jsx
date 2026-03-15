import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-8 py-16">

      <p className="text-green-600 font-semibold tracking-wide">
        ECO-FRIENDLY • SUSTAINABLE
      </p>

      <h1 className="text-5xl font-bold mt-4 max-w-2xl">
        Sustainable Living Starts with Coconut Coir.
      </h1>

      <button className="mt-6 bg-black text-white px-6 py-3 rounded-xl">
        Shop Collection
      </button>

      <div className="mt-20 text-center">
        <h2 className="text-xl font-bold mb-4">
          Why Choose Us?
        </h2>

        <div className="space-y-4">
          <p>🌿 100% Natural — Directly from farms</p>
          <p>💪 Durable — Built to last years</p>
          <p>🌎 Zero Waste — Completely biodegradable</p>
        </div>
      </div>

    </div>
  );
}
