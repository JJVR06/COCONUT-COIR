export default function Checkout() {
  return (
    <div className="form-container">
      <h2>Checkout</h2>
      <label>Receiving Method:</label>
      <select>
        <option>Delivery</option>
        <option>Pickup</option>
      </select>
      <label>Payment Method:</label>
      <select>
        <option>GCash</option>
        <option>Cash on Delivery</option>
      </select>
      <button className="btn-dark" style={{width:'100%', marginTop:'20px'}}>Place Order</button>
    </div>
  );
}