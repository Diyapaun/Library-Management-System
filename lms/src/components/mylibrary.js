import React, { useState, useEffect } from 'react';

const MyLibrary = () => {
  // ✅ 1. Initialize as an empty array to prevent the "Spread" crash
  const [issuedBooks, setIssuedBooks] = useState([]);
  const [filters, setFilters] = useState({
    sortBy: 'bookName'
  });

  useEffect(() => {
    // ✅ 2. Get User and Token from localStorage
    const userData = JSON.parse(localStorage.getItem('user'));
    const token = localStorage.getItem('token');

    if (userData && token) {
      // ✅ 3. Use the dynamic username and send the Token in headers
      fetch(`http://localhost:5001/myIssuedBooks/${userData.name}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
      })
        .then((res) => res.json())
        .then((data) => {
          // ✅ 4. Safety check: ensure data is an array
          setIssuedBooks(Array.isArray(data) ? data : []);
        })
        .catch((err) => {
            console.log(err);
            setIssuedBooks([]); // Set to empty array on error
        });
    }
  }, []);

  const handleReturn = async (id) => {
    const token = localStorage.getItem('token');
    try {
      await fetch(`http://localhost:5001/removeIssuedBook/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
      });

      const updatedBooks = issuedBooks.filter((book) => book._id !== id);
      setIssuedBooks(updatedBooks);
    } catch (err) {
      console.log(err);
    }
  };

  // ✅ 5. Fixed logic: Check if issuedBooks is valid before spreading
  const getFilteredAndSortedBooks = () => {
    if (!Array.isArray(issuedBooks)) return [];
    
    let result = [...issuedBooks];

    switch (filters.sortBy) {
      case 'bookName':
        result.sort((a, b) =>
          (a.bookName || "").localeCompare(b.bookName || "")
        );
        break;
      default:
        break;
    }

    return result;
  };

  return (
    <div className="container-fluid p-0 bg-transparent min-vh-100 w-100">
      <div className="container mt-4">
        <h2 className="fw-bold mb-4" style={{ color: '#4a4a6a' }}>My Issued Books</h2>

        {/* Sort */}
        <div className="d-flex mb-4" style={{ maxWidth: '200px' }}>
          <select
            value={filters.sortBy}
            onChange={(e) =>
              setFilters({
                ...filters,
                sortBy: e.target.value
              })
            }
            className="form-select shadow-sm"
            style={{ borderRadius: '10px' }}
          >
            <option value="bookName">Sort by Title</option>
          </select>
        </div>

        {/* Book Display */}
        <div className="row">
          {/* ✅ 6. Call the function here */}
          {getFilteredAndSortedBooks().map((book) => (
            <div key={book._id} className="col-md-4 mb-4">
              <div className="card p-4 border-0 shadow-sm" style={{ borderRadius: '20px', backgroundColor: '#ffffff' }}>
                <h4 className="fw-bold" style={{ color: '#9d8df1' }}>
                  {book.bookName}
                </h4>

                <p className="text-muted mb-1">Status: <span className="badge bg-success">Issued</span></p>

                <p className="small">
                  Issued on: {new Date(book.issueDate).toLocaleDateString()}
                </p>

                <button
                  className="btn btn-outline-danger mt-2"
                  style={{ borderRadius: '10px' }}
                  onClick={() => handleReturn(book._id)}
                >
                  Return Book
                </button>
              </div>
            </div>
          ))}
        </div>

        {issuedBooks.length === 0 && (
          <div className="text-center py-5">
            <p className="text-muted">
              No issued books in your library.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyLibrary;