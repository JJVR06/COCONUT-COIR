import SellerLayout from "../components/SellerLayout";

export default function Dashboard() {
  return (
    <SellerLayout>

      <h1>Seller Dashboard</h1>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(4,1fr)",
        gap: "20px"
      }}>

        <div style={{ background:"white", padding:"20px" }}>
          <h3>Today's Sales</h3>
          <p>₱0</p>
        </div>

        <div style={{ background:"white", padding:"20px" }}>
          <h3>Monthly Sales</h3>
          <p>₱0</p>
        </div>

        <div style={{ background:"white", padding:"20px" }}>
          <h3>Total Products</h3>
          <p>0</p>
        </div>

        <div style={{ background:"white", padding:"20px" }}>
          <h3>Pending Orders</h3>
          <p>0</p>
        </div>

      </div>

    </SellerLayout>
  );
}