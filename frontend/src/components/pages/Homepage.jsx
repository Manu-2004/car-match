import React from 'react';
import './homepage.css';

const Homepage = ({ onNavigation }) => {
  const handleCarComparison = () => {
    onNavigation('compare');
  };

  const handlePriceEstimator = () => {
    onNavigation('price-estimator');
  };

  return (
    <div className="homepage-container">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="title-container">
          <h1 className="main-title">
            <span className="title-car">Car</span>
            <span className="title-match">Match</span>
          </h1>
          <p className="subtitle">
            Your ultimate destination for smart car decisions
          </p>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <div className="cards-container">
          {/* Car Comparison Card */}
          <div className="feature-card comparison-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M9 17H7V10H9M13 17H11V7H13M17 17H15V13H17M19.5 19.1H4.5V5H19.5V19.1Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Car Comparison</h3>
              <p className="card-description">
                Compare multiple car models side by side with detailed specifications, 
                features, and performance metrics to make informed decisions.
              </p>
              <button 
                className="card-button comparison-button"
                onClick={handleCarComparison}
              >
                Compare Cars
                <span className="button-arrow">→</span>
              </button>
            </div>
          </div>

          {/* Price Estimator Card */}
          <div className="feature-card estimator-card">
            <div className="card-icon">
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path 
                  d="M12 2L13.09 8.26L19 9L13.09 9.74L12 16L10.91 9.74L5 9L10.91 8.26L12 2Z" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
                <path 
                  d="M12 18C13.1046 18 14 18.8954 14 20C14 21.1046 13.1046 22 12 22C10.8954 22 10 21.1046 10 20C10 18.8954 10.8954 18 12 18Z" 
                  stroke="currentColor" 
                  strokeWidth="2"
                />
              </svg>
            </div>
            <div className="card-content">
              <h3 className="card-title">Price Estimator</h3>
              <p className="card-description">
                Get accurate price estimates for both new and used cars based on 
                market trends, condition, and location-specific factors.
              </p>
              <button 
                className="card-button estimator-button"
                onClick={handlePriceEstimator}
              >
                Estimate Price
                <span className="button-arrow">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Homepage;
