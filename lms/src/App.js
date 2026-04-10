import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, NavLink, Navigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; 

// Components
import BookBase from './components/BookBase'; 
import MyLibrary from "./components/mylibrary";
import Favourits from "./components/favourits";
import Login from "./components/login";
import Signup from "./components/Signup"; 
import AdminDashboard from "./admin/AdminDashboard";
import ManageBooks from "./admin/ManageBooks";
import AddBook from "./admin/AddBook";
import AboutUs from "./components/aboutus";
import Audiobooks from "./components/audiobooks";
import ContactUs from "./components/contactus";
import MyAccount from "./components/myaccount";

// Protection Wrapper
const ProtectedRoute = ({ user, children, adminOnly = false }) => {
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && !user.isAdmin) return <Navigate to="/" replace />;
  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.clear(); 
    setUser(null); 
    window.location.href = "/login";
  };

  if (loading) return <div className="app-container" style={{background: '#f8f7ff', minHeight: '100vh'}}></div>;

  return (
    <BrowserRouter>
      <div className="app-container d-flex">
        
        {/* --- SIDEBAR --- */}
        <div className="sidebar shadow-sm" style={{ width: '260px', minHeight: '100vh', backgroundColor: '#fff' }}>
          <h4 className="px-3 py-4 mb-0 fw-bold" style={{ color: '#9d8df1' }}>LibraryMS</h4>
          
          <ul className="nav flex-column px-2">
            
            {/* 1. Discover: Only for regular users */}
            {!user?.isAdmin && (
              <li className="nav-item">
                <NavLink to="/" className="nav-link text-dark py-2">Discover</NavLink>
              </li>
            )}

            {/* 2. Main Navigation: Admin vs User */}
            {user?.isAdmin ? (
              <>
                <li className="nav-item mt-3 px-3">
                  <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Librarian Tools</small>
                </li>
                <li className="nav-item"><NavLink to="/admin-dashboard" className="nav-link text-dark">Dashboard</NavLink></li>
                <li className="nav-item"><NavLink to="/manage-books" className="nav-link text-dark">Manage Books</NavLink></li>
                <li className="nav-item"><NavLink to="/add-book" className="nav-link text-dark">Add New Book</NavLink></li>
              </>
            ) : (
              user && (
                <>
                  <li className="nav-item"><NavLink to="/mylibrary" className="nav-link text-dark">My Library</NavLink></li>
                  <li className="nav-item"><NavLink to="/favourits" className="nav-link text-dark">Favourites</NavLink></li>
                  <li className="nav-item"><NavLink to="/audiobooks" className="nav-link text-dark">Audiobooks</NavLink></li>
                  <li className="nav-item"><NavLink to="/account" className="nav-link text-dark">My Account</NavLink></li>
                </>
              )
            )}
            
            {/* 3. Support Section: HIDDEN for Admins */}
            {!user?.isAdmin && (
              <>
                <li className="nav-item mt-4 px-3">
                    <small className="text-muted fw-bold text-uppercase" style={{ fontSize: '0.7rem' }}>Support</small>
                </li>
                <li className="nav-item"><NavLink to="/about" className="nav-link text-dark">About Us</NavLink></li>
                <li className="nav-item"><NavLink to="/contact" className="nav-link text-dark">Contact Us</NavLink></li>
              </>
            )}

            <hr className="my-4 mx-3" style={{ opacity: 0.1 }} />

            {/* 4. User Profile & Logout */}
            {user ? (
              <div className="px-3 mt-auto pb-4">
                <p className="fw-bold mb-2 text-truncate" style={{ fontSize: '0.85rem', color: '#6f42c1' }}>
                  Logged in as: <br />
                  <span className="text-dark">{user.name}</span>
                </p>
                <button onClick={handleLogout} className="btn btn-sm btn-outline-danger w-100 rounded-3">
                  Logout
                </button>
              </div>
            ) : (
              <div className="px-2">
                <li className="nav-item"><NavLink to="/login" className="nav-link text-dark">Login</NavLink></li>
                <li className="nav-item"><NavLink to="/signup" className="nav-link text-dark">Signup</NavLink></li>
              </div>
            )}
          </ul>
        </div>

        {/* --- MAIN CONTENT AREA --- */}
        <div className="content flex-grow-1" style={{ backgroundColor: '#f8f7ff' }}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />

            {/* Home Route: Redirects Admins to Dashboard */}
            <Route path="/" element={!user?.isAdmin ? <BookBase /> : <Navigate to="/admin-dashboard" />} />

            {/* Admin Protected Routes */}
            <Route path="/admin-dashboard" element={<ProtectedRoute user={user} adminOnly={true}><AdminDashboard /></ProtectedRoute>} />
            <Route path="/manage-books" element={<ProtectedRoute user={user} adminOnly={true}><ManageBooks /></ProtectedRoute>} />
            <Route path="/add-book" element={<ProtectedRoute user={user} adminOnly={true}><AddBook /></ProtectedRoute>} />

            {/* User Protected Routes */}
            <Route path="/mylibrary" element={<ProtectedRoute user={user}><MyLibrary /></ProtectedRoute>} />
            <Route path="/favourits" element={<ProtectedRoute user={user}><Favourits /></ProtectedRoute>} />
            <Route path="/audiobooks" element={<ProtectedRoute user={user}><Audiobooks /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute user={user}><MyAccount /></ProtectedRoute>} />
            
            {/* Public/Support Routes */}
            <Route path="/about" element={<AboutUs />} />
            <Route path="/contact" element={<ContactUs />} />

            {/* Catch-all Redirect */}
            <Route path="*" element={<Navigate to={user?.isAdmin ? "/admin-dashboard" : "/"} />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  );
}

export default App;