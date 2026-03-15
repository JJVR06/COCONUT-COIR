import { Link } from "react-router-dom";

export default function SellerSidebar() {
  return (
    <div style={{
      width: "220px",
      height: "100vh",
      background: "#0E2011",
      color: "white",
      padding: "20px"
    }}>

      <h2>CocoFiber Admin</h2>

      <nav style={{
        display: "flex",
        flexDirection: "column",
        gap: "15px",
        marginTop: "30px"
      }}>

        <Link to="/seller/dashboard">Dashboard</Link>
        <Link to="/seller/inventory">Inventory</Link>
        <Link to="/seller/storefront">Storefront</Link>
        <Link to="/seller/reports">Reports</Link>

      </nav>

    </div>
  );
}