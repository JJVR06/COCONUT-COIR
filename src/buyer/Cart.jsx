import { Link } from 'react-router-dom';

export default function Cart() {
  return (
    <div style={{maxWidth: '800px', margin: '50px auto', padding: '0 20px'}}>
      <h2 style={{color: '#1B3022', marginBottom: '30px'}}>Your Shopping Cart</h2>
      
      <div style={{background: 'white', padding: '30px', borderRadius: '30px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)'}}>
        {/* Example Item */}
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '20px'}}>
          <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
            <div style={{width: '80px', height: '80px', background: '#F4F9F1', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>🥥</div>
            <div>
              <h4 style={{margin: '0'}}>Coco Peat (5kg)</h4>
              <p style={{margin: '5px 0', color: '#888', fontSize: '0.9rem'}}>Quantity: 1</p>
            </div>
          </div>
          <p style={{fontWeight: 'bold', fontSize: '1.2rem'}}>₱150.00</p>
        </div>

        {/* Total & Checkout Button */}
        <div style={{marginTop: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <div>
            <p style={{margin: '0', color: '#888'}}>Total Amount</p>
            <h3 style={{margin: '0', color: '#1B3022', fontSize: '1.8rem'}}>₱150.00</h3>
          </div>
          <Link to="/checkout" className="btn-dark" style={{textDecoration: 'none', padding: '15px 40px'}}>
            Checkout Now
          </Link>
        </div>
      </div>
    </div>
  );
}