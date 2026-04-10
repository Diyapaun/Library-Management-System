import React, { useEffect, useState } from 'react';
import data from '../Data.json';
import 'bootstrap/dist/css/bootstrap.min.css';

const Audiobooks = () => {
  const [audioData, setAudioData] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      setAudioData(data);
    }
  }, []);

  return (
    <div className="container-fluid py-5" style={{ backgroundColor: '#f8f7ff', minHeight: '100vh' }}>
      <div className="container">

        {/* Header Banner */}
        <div className="text-center mb-5">
          <div style={{
            backgroundColor: '#9d8df1', // Adjusted to match your sidebar theme
            color: '#FFFFFF',
            padding: '40px',
            borderRadius: '15px',
            fontSize: '32px',
            fontWeight: 'bold',
            boxShadow: '0 4px 15px rgba(157, 141, 241, 0.2)'
          }}>
            Explore Our Audio Collection
          </div>
        </div>

        <div className="row g-4">
          {audioData.map((item, index) => (
            <div key={item._id || index} className="col-md-6 col-lg-4">
              <div className="card h-100 border-0 shadow-sm rounded-4 text-center p-3">

                {/* Book Cover Image */}
                <div className="d-flex justify-content-center align-items-center mb-3" style={{ height: '250px' }}>
                  <img
                    src={`/img/${item.image}`}
                    className="img-fluid rounded-3"
                    alt={item.bookName}
                    style={{ maxHeight: '100%', objectFit: 'contain' }}
                    onError={(e) => { e.target.src = 'https://via.placeholder.com/150x220?text=No+Cover'; }}
                  />
                </div>

                <div className="card-body p-0">
                  <h5 className="fw-bold mb-1" style={{ color: '#4a4a6a' }}>{item.bookName}</h5>
                  <p className="text-muted small mb-3">By {item.author}</p>

                  {/* Audio Player Container */}
                  <div className="p-3 rounded-4" style={{ backgroundColor: '#f3f0ff' }}>
                    <p className="small fw-bold mb-2" style={{ color: '#6f42c1' }}>
                      <i className="bi bi-play-circle-fill me-2"></i>Audio Player
                    </p>

                    <audio 
                      controls 
                      className="w-100" 
                      preload="none" 
                      key={`audio-${index}`} // Forces Safari to treat each player as unique
                      style={{ height: '40px' }}
                    >
                      <source src="/audio/Pride_and_Prejudice_01.mp3" type="audio/mpeg" />
                      Your browser does not support the audio element.
                    </audio>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Audiobooks;