import SellerLayout from "../components/SellerLayout";

export default function Reports() {

  const inventoryReport = [
    { name:"Coir Door Mat", stock:20, sold:50 },
    { name:"Coir Rope", stock:40, sold:80 }
  ];

  return (
    <SellerLayout>

      <h1>Sales Reports</h1>

      <h3>Today's Sales: ₱0</h3>
      <h3>Monthly Sales: ₱0</h3>

      <h2>Inventory Report</h2>

      <table border="1" width="100%">

        <thead>
          <tr>
            <th>Product</th>
            <th>Stock</th>
            <th>Units Sold</th>
          </tr>
        </thead>

        <tbody>

          {inventoryReport.map(p => (
            <tr key={p.name}>
              <td>{p.name}</td>
              <td>{p.stock}</td>
              <td>{p.sold}</td>
            </tr>
          ))}

        </tbody>

      </table>

    </SellerLayout>
  );
}