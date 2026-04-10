import React from "react";
import { Link } from "react-router-dom";

const AboutUs = () => {
  // 1. Check if user is logged in
  const user = JSON.parse(localStorage.getItem("user"));
  
  const brandPurple = "#9d8df1";

  return (
    <div className="p-5" style={{ backgroundColor: '#f8f7ff', minHeight: '100vh' }}>
      <div className="container p-5 bg-white shadow-sm rounded-4">
        <h1 className="text-center fw-bold" style={{ color: brandPurple }}>About Book Base</h1>
        <p className="text-muted text-center mb-4">
          <i>Your Ultimate Library Management System</i>
        </p>
        <hr className="mb-5" style={{ opacity: '0.1' }} />

        <div className="row align-items-center">
          <div className="col-md-6 mb-4 mb-md-0">
            {/* Added a fallback placeholder in case library.jpg isn't in your public/img folder */}
            <img 
              src="/img/library.jpg" 
              alt="Library" 
              className="img-fluid rounded-4 shadow-sm" 
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80' }}
            />
          </div>
          <div className="col-md-6 px-lg-5">
            <p className="lead fw-bold" style={{ color: '#555' }}>
              Welcome to <strong>Book Base</strong>, an advanced library management system designed
              to simplify book tracking, borrowing, and management.
            </p>
            <p className="text-muted">
              Whether you are a student, researcher, or book lover, Book Base offers a seamless
              experience for managing and accessing your favorite books.
            </p>
            <p className="fw-bold mt-4" style={{ color: brandPurple }}>Why Choose Book Base?</p>
            <ul className="list-group list-group-flush border-0">
              <li className="list-group-item border-0 px-0">📚 Effortless book discovery</li>
              <li className="list-group-item border-0 px-0">🔄 Easy borrowing & returns</li>
              <li className="list-group-item border-0 px-0">🎧 Personalized audiobook collection</li>
              <li className="list-group-item border-0 px-0">❤️ Save & manage your favorites</li>
              <li className="list-group-item border-0 px-0">🔐 Secure user accounts</li>
            </ul>
          </div>
        </div>

        {/* 2. Conditional Rendering for the Button */}
        <div className="text-center mt-5">
          {!user ? (
            // Only shows if user is NOT logged in
            <Link 
              to="/login" 
              className="btn btn-lg text-white px-5 py-3 fw-bold border-0" 
              style={{ backgroundColor: brandPurple, borderRadius: '12px', boxShadow: '0 4px 15px rgba(157, 141, 241, 0.3)' }}
            >
              Join Now
            </Link>
          ) : (
            // Shows a welcoming message if they are already logged in
            <div className="p-3 rounded-3" style={{ backgroundColor: '#f3f0ff', display: 'inline-block' }}>
               <h5 className="mb-0" style={{ color: '#6f42c1' }}>
                 Welcome back, {user.name}! 📖
               </h5>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AboutUs;