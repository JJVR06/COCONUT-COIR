export default function Storefront() {
  const prods = [
    { name: "Coir Door Mat", price: 349, color: "#E0F2FE" },
    { name: "Garden Coir Pot", price: 185, color: "#FEF3C7" },
    { name: "Erosion Net", price: 920, color: "#DCFCE7" },
  ];

  return (
    <div style={{padding:'40px 5%'}}>
      <h1>Our Products</h1>
      <div className="product-grid">
        {prods.map(p => (
          <div className="product-card" key={p.name}>
            <div className="img-container" style={{background: p.color}}>📦</div>
            <h3>{p.name}</h3>
            <p style={{fontWeight:'bold', fontSize:'1.2rem'}}>₱{p.price}</p>
            <button className="btn-dark">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}