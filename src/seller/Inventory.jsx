import { useState } from "react";
import SellerLayout from "../components/SellerLayout";

export default function Inventory() {

  const [products, setProducts] = useState([
    { id:1, name:"Coir Door Mat", category:"Home", price:349, stock:20 },
    { id:2, name:"Coir Rope", category:"Garden", price:120, stock:50 }
  ]);

  const [showForm, setShowForm] = useState(false);

  const [newProduct, setNewProduct] = useState({
    name:"",
    category:"",
    price:"",
    stock:""
  });

  const handleChange = (e) => {
    setNewProduct({
      ...newProduct,
      [e.target.name]: e.target.value
    });
  };

  const addProduct = () => {

    const product = {
      id: products.length + 1,
      ...newProduct
    };

    setProducts([...products, product]);

    setNewProduct({
      name:"",
      category:"",
      price:"",
      stock:""
    });

    setShowForm(false);
  };

  return (
    <SellerLayout>

      <h1>Inventory Management</h1>

      <button onClick={() => setShowForm(true)}>
        Add Product
      </button>

      {showForm && (
        <div style={{background:"#fff", padding:"20px", marginTop:"20px", width:"300px"}}>

          <h3>Add Product</h3>

          <input
            placeholder="Product Name"
            name="name"
            value={newProduct.name}
            onChange={handleChange}
          />

          <br />

          <input
            placeholder="Category"
            name="category"
            value={newProduct.category}
            onChange={handleChange}
          />

          <br />

          <input
            placeholder="Price"
            name="price"
            value={newProduct.price}
            onChange={handleChange}
          />

          <br />

          <input
            placeholder="Stock"
            name="stock"
            value={newProduct.stock}
            onChange={handleChange}
          />

          <br /><br />

          <button onClick={addProduct}>
            Save Product
          </button>

        </div>
      )}

      <table border="1" width="100%" style={{marginTop:"20px"}}>

        <thead>
          <tr>
            <th>Product</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
          </tr>
        </thead>

        <tbody>

          {products.map(product => (

            <tr key={product.id}>
              <td>{product.name}</td>
              <td>{product.category}</td>
              <td>₱{product.price}</td>
              <td>{product.stock}</td>
            </tr>

          ))}

        </tbody>

      </table>

    </SellerLayout>
  );
}