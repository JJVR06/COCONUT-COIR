import React from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
  return (
    /* Center the login box on the page */
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
      
      <div className="form-container" style={{ margin: '0', width: '100%' }}>
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: '#1B3022', fontSize: '2rem', margin: '0' }}>Welcome Back</h2>
          <p style={{ color: '#666', marginTop: '10px' }}>Sign in to continue to CocoFiber</p>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1B3022', display: 'block', marginBottom: '5px' }}>
              EMAIL ADDRESS
            </label>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required 
            />
          </div>

          <div style={{ marginBottom: '10px' }}>
            <label style={{ fontSize: '0.8rem', fontWeight: 'bold', color: '#1B3022', display: 'block', marginBottom: '5px' }}>
              PASSWORD
            </label>
            <input 
              type="password" 
              placeholder="••••••••" 
              required 
            />
          </div>

          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <Link to="#" style={{ fontSize: '0.85rem', color: '#82CD47', textDecoration: 'none', fontWeight: '600' }}>
              Forgot Password?
            </Link>
          </div>

          <button className="btn-dark" style={{ width: '100%', padding: '15px', fontSize: '1rem' }}>
            Sign In
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
          <p style={{ color: '#666', fontSize: '0.9rem' }}>
            Don't have an account?{' '}
            <Link to="/register" style={{ color: '#82CD47', fontWeight: 'bold', textDecoration: 'none' }}>
              Register Now
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}