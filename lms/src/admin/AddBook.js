import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddBook = () => {
  const navigate = useNavigate();
  const [book, setBook] = useState({
    image: "", bookName: "", author: "", isbn: "",
    category: "", price: "", pages: "", description: ""
  });

  const handleChange = (e) => {
    setBook({ ...book, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      const res = await axios.post("http://localhost:5001/addBook", book, {
        headers: { Authorization: `Bearer ${token}` } // ✅ JWT Included
      });
      if (res.data.success) {
        alert("Book added successfully!");
        navigate("/manage-books");
      }
    } catch (err) {
      alert("Failed to add book. Ensure you are an Admin.");
    }
  };

  return (
    <div className="container mt-4 bg-white p-4 rounded shadow">
      <h2 className="mb-4">Add New Library Book</h2>
      <form onSubmit={handleSubmit} className="row g-3">
        {Object.keys(book).map((key) => (
          <div className="col-md-6" key={key}>
            <label className="text-capitalize">{key}</label>
            <input name={key} className="form-control" placeholder={`Enter ${key}`} onChange={handleChange} required />
          </div>
        ))}
        <div className="col-12 mt-4">
          <button type="submit" className="btn btn-success w-100">Save to Library</button>
        </div>
      </form>
    </div>
  );
};

export default AddBook;