import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for navigation

export default function Home() {
  return (
    <div>
      <section className="hero">
        <p style={{color:'#82CD47', fontWeight:'bold'}}>ECO-FRIENDLY • SUSTAINABLE</p>
        <h1>Sustainable Living Starts with <span>Coconut Coir.</span></h1>
        
        {/* Updated Button to Link to /products */}
        <Link to="/products">
          <button className="btn">Shop Collection</button>
        </Link>
      </section>
      
      <div style={{textAlign:'center', padding:'50px 20px'}}>
        <h2>Why Choose Us?</h2>
        <div className="product-grid">
          <div className="product-card">
            <h3>🌿 100% Natural</h3>
            <p>Directly from farms</p>
          </div>
          <div className="product-card">
            <h3>💪 Durable</h3>
            <p>Built to last years</p>
          </div>
          <div className="product-card">
            <h3>🌍 Zero Waste</h3>
            <p>Completely biodegradable</p>
          </div>
        </div>
      </div>
    </div>
  );
}