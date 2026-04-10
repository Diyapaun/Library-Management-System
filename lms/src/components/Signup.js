import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';

const Signup = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // ✅ Role is no longer sent from Frontend; Backend defaults it to 'user'
      const res = await axios.post('http://localhost:5001/Signup', { name, email, password });
      if (res.data.success) {
        alert("Account created successfully! Please login.");
        navigate('/login');
      }
    } catch (err) {
      alert("Signup failed. Email might already exist.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-5 border-0 shadow-sm" style={{ width: '420px', borderRadius: '25px' }}>
        <h2 className="text-center fw-bold mb-4" style={{ color: '#9d8df1' }}>Create Account</h2>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Full Name</label>
            <input type="text" className="form-control" style={{ borderRadius: '12px' }} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Email</label>
            <input type="email" className="form-control" style={{ borderRadius: '12px' }} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Password</label>
            <input type="password" className="form-control" style={{ borderRadius: '12px' }} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary w-100 py-2" style={{ backgroundColor: '#9d8df1', border: 'none', borderRadius: '12px' }}>
            Sign Up
          </button>
        </form>
        <p className="text-center mt-4 small text-muted">
          Already have an account? <NavLink to="/login" style={{ color: '#9d8df1', textDecoration: 'none', fontWeight: 'bold' }}>Login</NavLink>
        </p>
      </div>
    </div>
  );
};

export default Signup;