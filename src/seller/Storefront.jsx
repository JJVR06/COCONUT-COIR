import SellerLayout from "../components/SellerLayout";

export default function Storefront() {

  return (
    <SellerLayout>

      <h1>Storefront Manager</h1>

      <div style={{ background:"white", padding:"20px", maxWidth:"500px" }}>

        <label>Hero Title</label>
        <input style={{width:"100%"}} />

        <label>Description</label>
        <textarea style={{width:"100%"}} />

        <button>Save Changes</button>

      </div>

    </SellerLayout>
  );
}