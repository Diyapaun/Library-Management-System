import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalBooks: 0, totalIssued: 0, totalUsers: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        // ✅ Call the new stats endpoint
        const res = await axios.get('http://localhost:5001/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.data.success) {
          setStats(res.data.stats);
        }
      } catch (err) {
        console.error("Error fetching admin stats:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    { title: "Total Books", value: stats.totalBooks, color: "#9d8df1", icon: "📚" },
    { title: "Books Issued", value: stats.totalIssued, color: "#ffb7b2", icon: "🤝" },
    { title: "Total Readers", value: stats.totalUsers, color: "#b2e2f2", icon: "👥" }
  ];

  return (
    <div className="container-fluid p-4">
      <div className="mb-5">
        <h2 className="fw-bold" style={{ color: '#4a4a6a' }}>Library Overview</h2>
        <p className="text-muted">Welcome back! Here is what's happening today.</p>
      </div>

      <div className="row">
        {cards.map((card, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card border-0 shadow-sm p-4" 
                 style={{ 
                   borderRadius: '20px', 
                   background: '#ffffff',
                   borderLeft: `8px solid ${card.color}` 
                 }}>
              <div className="d-flex align-items-center justify-content-between">
                <div>
                  <p className="text-uppercase small fw-bold text-muted mb-1">{card.title}</p>
                  <h1 className="fw-bold mb-0" style={{ color: '#4a4a6a' }}>
                    {loading ? "..." : card.value}
                  </h1>
                </div>
                <div style={{ fontSize: '2.5rem' }}>{card.icon}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="row mt-4">
        <div className="col-md-8">
          <div className="card border-0 shadow-sm p-4" style={{ borderRadius: '20px' }}>
            <h5 className="fw-bold mb-3" style={{ color: '#4a4a6a' }}>System Actions</h5>
            <div className="d-flex gap-2">
              <button className="btn btn-primary" style={{ background: '#9d8df1', border: 'none', borderRadius: '10px' }}>
                Download Full Inventory
              </button>
              <button className="btn btn-outline-secondary" style={{ borderRadius: '10px' }}>
                Refresh Data
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;