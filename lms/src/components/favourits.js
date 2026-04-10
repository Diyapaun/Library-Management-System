import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Favourits = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      // Get the logged-in user's data
      const userData = JSON.parse(localStorage.getItem('user'));
      const token = localStorage.getItem('token');

      if (!userData || !token) {
        setLoading(false);
        return;
      }

      try {
        // Call the backend route we added to your index.js
        const res = await axios.get(`http://localhost:5001/getFavorites/${userData.name}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFavorites(res.data);
      } catch (err) {
        console.error("Error fetching favorites:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, []);

  const handleRemove = async (bookId) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:5001/removeFavorite/${userData.name}/${bookId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFavorites(favorites.filter(book => book._id !== bookId));
    } catch (err) {
      alert("Error removing favorite");
    }
  };

  if (loading) return <div className="p-5 text-center">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-4" style={{ color: '#4a4a6a' }}>My Favorites</h2>
      
      {favorites.length === 0 ? (
        <div className="text-center py-5">
           <i className="bi bi-heart text-muted" style={{ fontSize: '3rem' }}></i>
           <h4 className="mt-3">No Favorites Yet</h4>
           <p className="text-muted">Books you favorite on the Discover page will appear here!</p>
        </div>
      ) : (
        <div className="row">
          {favorites.map((book) => (
            <div className="col-md-3 mb-4" key={book._id}>
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: '15px' }}>
                <img 
                  src={`/img/${book.image}`} 
                  className="card-img-top rounded-top" 
                  alt={book.bookName} 
                  style={{ height: '220px', objectFit: 'cover' }} 
                />
                <div className="card-body text-center">
                  <h6 className="fw-bold text-truncate">{book.bookName}</h6>
                  <p className="small text-muted mb-2">{book.author}</p>
                  <button 
                    className="btn btn-sm btn-outline-danger w-100"
                    onClick={() => handleRemove(book._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourits;