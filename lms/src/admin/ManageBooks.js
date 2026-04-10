import React, { useEffect, useState } from "react";
import axios from "axios";

const ManageBooks = () => {
  const [books, setBooks] = useState([]);
  const token = localStorage.getItem("token");

  const fetchBooks = async () => {
    const res = await axios.get("http://localhost:5001/books");
    setBooks(res.data);
  };

  useEffect(() => { fetchBooks(); }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to remove this book?")) {
      try {
        await axios.delete(`http://localhost:5001/removeBook/${id}`, {
          headers: { Authorization: `Bearer ${token}` } // ✅ JWT for deletion
        });
        fetchBooks();
      } catch (err) {
        alert("Delete failed. Token might be expired.");
      }
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Inventory Management</h2>
      <table className="table table-hover bg-white rounded shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>Book Name</th>
            <th>Author</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b._id}>
              <td className="fw-bold">{b.bookName}</td>
              <td>{b.author}</td>
              <td>{b.category || "General"}</td>
              <td>
                <button onClick={() => handleDelete(b._id)} className="btn btn-sm btn-danger">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageBooks;