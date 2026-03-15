import React from 'react';

export default function History() {
  // Mock Data: Sample orders to show during your defense
  const orders = [
    { 
      id: 'ORD-2026-001', 
      date: 'March 10, 2026', 
      total: 450.00, 
      status: 'Delivered', 
      item: 'Coco Peat (5kg)',
      icon: '🌱'
    },
    { 
      id: 'ORD-2026-002', 
      date: 'March 12, 2026', 
      total: 185.00, 
      status: 'Processing', 
      item: 'Garden Coir Pot',
      icon: '🪴'
    }
  ];

  return (
    /* This outer div ensures the page has enough height so the footer stays down */
    <div style={{ minHeight: '80vh', padding: '40px 5%' }}>
      
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ color: '#1B3022', marginBottom: '10px' }}>Transaction History</h2>
        <p style={{ color: '#666', marginBottom: '30px' }}>Review your past sustainable purchases.</p>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {orders.map((order) => (
            <div key={order.id} className="product-card" style={{
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '20px 30px'
            }}>
              <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                <div style={{ 
                  fontSize: '1.5rem', 
                  background: '#F4F9F1', 
                  width: '50px', 
                  height: '50px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  borderRadius: '15px' 
                }}>
                  {order.icon}
                </div>
                <div>
                  <p style={{ margin: '0', color: '#888', fontSize: '0.7rem', fontWeight: 'bold' }}>{order.id}</p>
                  <h4 style={{ margin: '2px 0', color: '#1B3022' }}>{order.item}</h4>
                  <p style={{ margin: '0', fontSize: '0.8rem', color: '#999' }}>{order.date}</p>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <p style={{ margin: '0', fontWeight: 'bold', color: '#1B3022', fontSize: '1.2rem' }}>
                  ₱{order.total.toFixed(2)}
                </p>
                <span style={{
                  fontSize: '0.7rem', 
                  background: order.status === 'Delivered' ? '#DCFCE7' : '#FEF3C7', 
                  color: order.status === 'Delivered' ? '#166534' : '#92400E', 
                  padding: '5px 12px', 
                  borderRadius: '20px', 
                  fontWeight: 'bold',
                  display: 'inline-block',
                  marginTop: '8px'
                }}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}