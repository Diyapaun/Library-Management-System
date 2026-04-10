import React from "react";

const ContactUs = () => {
  // Common style variable for consistency
  const brandPurple = "#9d8df1";
  const darkPurple = "#6f42c1";

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f7ff', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        {/* Main Content */}
        <div className="col-md-10">
          <h2 className="text-center mb-2 fw-bold" style={{ color: brandPurple }}>Contact Us</h2>
          <p className="text-center text-muted mb-5">
            Need help? Have questions? Feel free to reach out to us!
          </p>

          <div className="row g-4">
            {/* Contact Form */}
            <div className="col-md-6">
              <div className="card border-0 p-4 shadow-sm rounded-4">
                <h4 className="text-center mb-4 fw-bold" style={{ color: brandPurple }}>Send Us a Message</h4>
                <form>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Name</label>
                    <input type="text" className="form-control border-0 bg-light p-3" placeholder="Enter your name" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Email</label>
                    <input type="email" className="form-control border-0 bg-light p-3" placeholder="Enter your email" required />
                  </div>
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-muted">Message</label>
                    <textarea className="form-control border-0 bg-light p-3" rows="4" placeholder="Your message" required></textarea>
                  </div>
                  <button 
                    type="submit" 
                    className="btn border-0 w-100 py-3 fw-bold text-white shadow-sm"
                    style={{ backgroundColor: brandPurple, borderRadius: '10px' }}
                  >
                    Send Message
                  </button>
                </form>
              </div>
            </div>

            {/* Contact Information */}
            <div className="col-md-6">
              <div className="card border-0 p-4 shadow-sm rounded-4 h-100" style={{ backgroundColor: '#ffffff' }}>
                <h4 className="text-center mb-4 fw-bold" style={{ color: brandPurple }}>Connect with Us</h4>
                
                <div className="mb-4 p-3 rounded-3" style={{ backgroundColor: '#f3f0ff' }}>
                  <p className="mb-1"><strong>Email Support:</strong></p>
                  <p className="text-muted mb-0">support@bookbase.com</p>
                </div>

                <div className="list-group list-group-flush border-0">
                  <div className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                    <span>Help Center</span>
                    <a href="#" className="text-decoration-none fw-bold" style={{ color: darkPurple }}>Visit →</a>
                  </div>
                  <div className="list-group-item border-0 px-0 d-flex justify-content-between align-items-center">
                    <span>Community Forum</span>
                    <a href="#" className="text-decoration-none fw-bold" style={{ color: darkPurple }}>Join →</a>
                  </div>
                </div>

                <div className="mt-auto pt-4 text-center">
                  <p className="small fw-bold text-muted mb-3 text-uppercase">Follow Us</p>
                  <div className="d-flex justify-content-center gap-3">
                    {['Facebook', 'Twitter', 'LinkedIn'].map((social) => (
                      <a key={social} href="#" className="btn btn-sm px-3 rounded-pill text-white border-0 shadow-sm" style={{ backgroundColor: brandPurple }}>
                        {social}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;