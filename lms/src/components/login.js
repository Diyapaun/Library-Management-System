import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, NavLink } from 'react-router-dom';

const login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState(''); // ✅ State to hold the error message
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg(''); // Clear previous errors

    try {
      const res = await axios.post('http://localhost:5001/Login', { email, password });
      
      if (res.data.success) {
        localStorage.setItem('token', res.data.token);
        localStorage.setItem('user', JSON.stringify(res.data.user));
        setUser(res.data.user);
        
        if (res.data.user.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      } else {
        // ✅ This will now display "User not found" or "Incorrect password"
        setErrorMsg(res.data.message); 
      }
    } catch (err) {
      setErrorMsg("Unable to connect to the server.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <div className="card p-5 border-0 shadow-sm" style={{ width: '420px', borderRadius: '25px' }}>
        <h2 className="text-center fw-bold mb-4" style={{ color: '#9d8df1' }}>Login</h2>

        {/* ✅ Error Alert Box */}
        {errorMsg && (
          <div className="alert alert-danger py-2 px-3 small text-center" style={{ borderRadius: '12px', border: 'none' }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label small fw-bold text-muted">Email Address</label>
            <input 
              type="email" 
              className="form-control" 
              style={{ borderRadius: '12px' }} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold text-muted">Password</label>
            <input 
              type="password" 
              className="form-control" 
              style={{ borderRadius: '12px' }} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            className="btn btn-primary w-100 py-2" 
            style={{ backgroundColor: '#9d8df1', border: 'none', borderRadius: '12px', fontWeight: 'bold' }}
          >
            Sign In
          </button>
        </form>

        <p className="text-center mt-4 small text-muted">
          New here? <NavLink to="/signup" className="fw-bold" style={{ color: '#9d8df1', textDecoration: 'none' }}>Create Account</NavLink>
        </p>
      </div>
    </div>
  );
};

export default login;