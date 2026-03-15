export default function Profile() {
  return (
    <div style={{maxWidth: '500px', margin: '50px auto', textAlign: 'center'}}>
      <div style={{width: '100px', height: '100px', background: '#82CD47', borderRadius: '50%', margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', color: 'white', fontWeight: 'bold'}}>
        JD
      </div>
      <h2 style={{margin: '0', color: '#1B3022'}}>Juan Dela Cruz</h2>
      <p style={{color: '#888', marginBottom: '30px'}}>juan.delacruz@email.com</p>

      <div style={{background: 'white', padding: '30px', borderRadius: '30px', textAlign: 'left', boxShadow: '0 5px 15px rgba(0,0,0,0.05)'}}>
        <div style={{marginBottom: '20px'}}>
          <label style={{fontSize: '0.7rem', fontWeight: 'bold', color: '#BBB', textTransform: 'uppercase'}}>Mobile Number</label>
          <p style={{margin: '5px 0', fontWeight: '600'}}>+63 912 345 6789</p>
        </div>
        <div>
          <label style={{fontSize: '0.7rem', fontWeight: 'bold', color: '#BBB', textTransform: 'uppercase'}}>Default Address</label>
          <p style={{margin: '5px 0', fontWeight: '600'}}>123 Coconut St., Brgy. Fiber, Davao City, 8000</p>
        </div>
        <button className="btn" style={{width: '100%', marginTop: '20px', background: '#eee'}}>Edit Profile</button>
      </div>
    </div>
  );
}