import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const BookBase = () => {
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [featuredBook, setFeaturedBook] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await axios.get('http://localhost:5001/books');
        setBooks(res.data);
        if (res.data.length > 0) setFeaturedBook(res.data[0]);
      } catch (err) {
        console.error("Error fetching books:", err);
      }
    };
    fetchBooks();
  }, []);

  const handleIssue = async (book) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      alert("Please login to issue books!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/issueBook", {
        username: userData.name,
        bookName: book.bookName,
        bookId: book._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        alert("Success! " + book.bookName + " has been added to My Library.");
      }
    } catch (err) {
      alert("Could not update database.");
    }
  };

  const toggleFavorite = async (book) => {
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');
    
    if (!userData || !token) {
      alert("Please login to add favourites!");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5001/addFavorite", {
        username: userData.name,
        bookName: book.bookName,
        bookId: book._id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (res.data.success) {
        alert("Added to Favourites collection!");
      }
    } catch (err) {
      alert("Database error.");
    }
  };

  const categories = ['All', ...new Set(books.map(book => book.category))];
  const filteredBooks = activeCategory === 'All' ? books : books.filter(book => book.category === activeCategory);

  return (
    <div className="container-fluid p-0 bg-transparent w-100">
      <div className="container mt-2">
        <div className="row">
          <div className="col-md-8">
            <h4 className="fw-bold mb-4" style={{ color: '#4a4a6a' }}>Recommended for you</h4>
            
            <div className="d-flex overflow-auto mb-5 pb-3">
              {books.slice(0, 8).map((book) => (
                <div className="me-4" key={book._id} style={{ minWidth: '160px' }}>
                  <div className="card border-0" onClick={() => setFeaturedBook(book)} style={{cursor:'pointer', borderRadius: '15px'}}>
                    <img src={`/img/${book.image}`} className="card-img-top rounded-top" alt={book.bookName} style={{ height: '220px', objectFit: 'cover' }} />
                    <div className="card-body p-2 text-center">
                      <h6 className="text-truncate small fw-bold">{book.bookName}</h6>
                      <button 
                        className="btn btn-sm w-100 mt-1" 
                        style={{ backgroundColor: '#f0edff', color: '#9d8df1', borderRadius: '8px', border: 'none' }}
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(book); }}
                      >
                        + Favourite
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <h5 className="fw-bold mb-3" style={{ color: '#4a4a6a' }}>Browse Categories</h5>
            <div className="d-flex flex-wrap gap-2 mb-5">
              {categories.map((cat, i) => (
                <button 
                  key={i} 
                  className="btn btn-sm rounded-pill px-3" 
                  style={{ 
                    backgroundColor: activeCategory === cat ? '#9d8df1' : '#ffffff',
                    color: activeCategory === cat ? '#ffffff' : '#4a4a6a',
                    border: '1px solid #eee'
                  }}
                  onClick={() => setActiveCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="row">
                {filteredBooks.map((book) => (
                    <div className="col-md-4 mb-4" key={book._id}>
                        <div 
                          className="card border-0 h-100 p-2 shadow-sm" 
                          style={{ borderRadius: '15px', cursor: 'pointer' }}
                          onClick={() => setFeaturedBook(book)}
                        >
                            <img src={`/img/${book.image}`} className="rounded mb-2 w-100" alt={book.bookName} style={{ height: '180px', objectFit: 'cover' }} />
                            <h6 className="text-truncate small mb-2 fw-bold" style={{ color: '#4a4a6a' }}>{book.bookName}</h6>
                            
                            {/* --- Action Buttons for All Books --- */}
                            <div className="d-flex gap-1">
                              <button 
                                className="btn btn-sm flex-grow-1" 
                                style={{ backgroundColor: '#f0edff', color: '#9d8df1', fontSize: '10px' }}
                                onClick={(e) => { e.stopPropagation(); toggleFavorite(book); }}
                              >
                                Favorite
                              </button>
                              <button 
                                className="btn btn-sm btn-primary flex-grow-1" 
                                style={{ backgroundColor: '#9d8df1', border: 'none', fontSize: '10px' }}
                                onClick={(e) => { e.stopPropagation(); handleIssue(book); }}
                              >
                                Issue
                              </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
          </div>

          {/* --- RIGHT SIDEBAR --- */}
          <div className="col-md-4">
            <div className="bg-white rounded-4 p-4 text-center shadow-sm" style={{ position: 'sticky', top: '80px', border: '1px solid #f0edff' }}>
              {featuredBook ? (
                <div>
                  <img src={`/img/${featuredBook.image}`} alt="cover" className="rounded-3 mb-3 shadow" style={{ width: '180px' }} />
                  <h4 style={{ color: '#4a4a6a' }}>{featuredBook.bookName}</h4>
                  <p className="text-muted mb-4">{featuredBook.author}</p>
                  
                  <div className="d-grid gap-2">
                    <button className="btn btn-primary btn-lg" onClick={() => handleIssue(featuredBook)} style={{ backgroundColor: '#9d8df1', border: 'none', borderRadius: '12px' }}>
                        Issue Now
                    </button>
                    <button className="btn btn-outline-secondary" onClick={() => toggleFavorite(featuredBook)} style={{ borderRadius: '12px' }}>
                        Save for later
                    </button>
                  </div>
                </div>
              ) : <p className="text-muted">Select a book to see details</p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookBase;