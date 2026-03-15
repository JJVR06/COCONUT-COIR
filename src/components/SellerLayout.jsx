import SellerSidebar from "./SellerSidebar";

export default function SellerLayout({ children }) {
  return (
    <div style={{ display: "flex" }}>

      <SellerSidebar />

      <div style={{
        flex: 1,
        padding: "30px",
        background: "#f5f5f5"
      }}>
        {children}
      </div>

    </div>
  );
}